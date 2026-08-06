import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const errors = [];

function trackedMarkdownFiles() {
  const output = execFileSync("git", ["ls-files", "-z", "--", "*.md"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
  return output
    .split("\0")
    .filter((file) => file.length > 0)
    .map((file) => path.resolve(repositoryRoot, file));
}

function relative(file) {
  return path.relative(repositoryRoot, file);
}

function stableIds(text) {
  return new Set(
    text.match(/\b(?:D|P|F|B|W|I|E2E|Q|H|R|ISSUE|MVP)-\d{2,3}\b/g) ?? [],
  );
}

function canonicalState(value) {
  const tracked = value.match(/^TRACKED BY ISSUE-\d{3}/)?.[0];
  if (tracked !== undefined) return tracked;
  return value.match(/^(?:CONFIRMED|DONE|TODO|BLOCKED)\b/)?.[0] ?? value;
}

function decisionStates(text) {
  const states = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\|\s*(D-\d{2})\s*\|\s*`([^`]+)`\s*\|/);
    if (match?.[1] !== undefined && match[2] !== undefined) {
      states.set(match[1], canonicalState(match[2]));
    }
  }
  return states;
}

function taskStates(text) {
  const states = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(
      /^#### .*\b((?:P|F|B|W|I|E2E|Q|H|R)-\d{2,3})\b.*—\s*`([^`]+)`\s*$/,
    );
    if (match?.[1] !== undefined && match[2] !== undefined) {
      states.set(match[1], canonicalState(match[2]));
    }
  }
  return states;
}

function issueStates(text) {
  const states = new Map();
  let currentIssue;
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      currentIssue = line.match(/\bISSUE-\d{3}\b/)?.[0];
      continue;
    }
    const state = line.match(
      /^- \*\*(?:Status:|\u72b6\u6001\uff1a)\*\* `([^`]+)`\s*$/,
    )?.[1];
    if (currentIssue !== undefined && state !== undefined) {
      states.set(currentIssue, canonicalState(state));
    }
  }
  return states;
}

function compareSets(label, english, follower) {
  for (const value of english) {
    if (!follower.has(value))
      errors.push(`${label}: follower is missing ${value}`);
  }
  for (const value of follower) {
    if (!english.has(value))
      errors.push(`${label}: English is missing ${value}`);
  }
}

function compareMaps(label, english, follower) {
  compareSets(label, new Set(english.keys()), new Set(follower.keys()));
  for (const [id, state] of english) {
    const followerState = follower.get(id);
    if (followerState !== undefined && followerState !== state) {
      errors.push(
        `${label}: ${id} is ${state} in English and ${followerState} in the follower`,
      );
    }
  }
}

function markdownOutsideCode(text, preserveInlineCode = false) {
  let inFence = false;
  const lines = [];
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*(?:\x60{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) {
      lines.push(
        line.replace(/\x60+([^\x60]*)\x60+/g, preserveInlineCode ? "$1" : ""),
      );
    }
  }
  return lines.join("\n");
}

function headingAnchors(text) {
  const source = markdownOutsideCode(text, true);
  const lines = source.split(/\r?\n/);
  const anchors = new Set();
  const counts = new Map();

  function addHeading(value) {
    const base = value
      .replace(/!\[([^\]]*)]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/<[^>]*>/g, "")
      .replace(/[*_~]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\-\s]/gu, "")
      .replace(/\s+/g, "-");
    if (base.length === 0) return;
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    anchors.add(count === 0 ? base : base + "-" + count);
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const atx = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (atx?.[1] !== undefined) {
      addHeading(atx[1]);
      continue;
    }
    const underline = lines[index + 1] ?? "";
    if (line.trim().length > 0 && /^ {0,3}(?:=+|-+)\s*$/.test(underline)) {
      addHeading(line);
      index += 1;
    }
  }

  for (const match of source.matchAll(/\bid=["']([^"']+)["']/g)) {
    if (match[1] !== undefined) anchors.add(match[1]);
  }
  return anchors;
}

function normalizeReferenceId(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function checkTarget(file, rawTarget, anchorsByFile) {
  let target = rawTarget.trim();
  if (target.startsWith("<") && target.endsWith(">")) {
    target = target.slice(1, -1);
  }
  if (target.length === 0 || /^[a-z][a-z0-9+.-]*:/i.test(target)) {
    return;
  }

  const hashIndex = target.indexOf("#");
  const pathPart = hashIndex === -1 ? target : target.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? "" : target.slice(hashIndex + 1);
  let decodedPath;
  let decodedFragment;
  try {
    decodedPath = decodeURIComponent(pathPart);
    decodedFragment = decodeURIComponent(fragment);
  } catch {
    errors.push(relative(file) + ": malformed local link " + target);
    return;
  }

  const destination =
    decodedPath.length === 0
      ? file
      : path.resolve(path.dirname(file), decodedPath);
  if (!existsSync(destination)) {
    errors.push(relative(file) + ": missing local link " + target);
    return;
  }

  if (decodedFragment.length === 0) return;
  const anchors = anchorsByFile.get(destination);
  if (anchors === undefined) {
    errors.push(
      relative(file) + ": anchor target is not tracked Markdown " + target,
    );
    return;
  }
  if (
    !anchors.has(decodedFragment) &&
    !anchors.has(decodedFragment.toLowerCase())
  ) {
    errors.push(relative(file) + ": missing local anchor " + target);
  }
}

function checkLocalLinks(file, text, anchorsByFile) {
  const source = markdownOutsideCode(text);
  const definitions = new Map();
  const definitionPattern = /^ {0,3}\[([^\]]+)]\s*:\s*(<[^>]+>|[^\s]+).*$/gm;

  for (const match of source.matchAll(definitionPattern)) {
    if (match[1] === undefined || match[2] === undefined) continue;
    const id = normalizeReferenceId(match[1]);
    definitions.set(id, match[2]);
    checkTarget(file, match[2], anchorsByFile);
  }

  const withoutDefinitions = source.replace(definitionPattern, "");
  const inlinePattern =
    /!?\[[^\]]*]\(\s*(<[^>]+>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
  for (const match of withoutDefinitions.matchAll(inlinePattern)) {
    if (match[1] !== undefined) {
      checkTarget(file, match[1], anchorsByFile);
    }
  }

  const referencePattern = /!?\[([^\]]+)]\[([^\]]*)]/g;
  for (const match of withoutDefinitions.matchAll(referencePattern)) {
    const label = match[1];
    if (label === undefined) continue;
    const id = normalizeReferenceId(
      match[2] === undefined || match[2].length === 0 ? label : match[2],
    );
    if (!definitions.has(id)) {
      errors.push(
        relative(file) + ": missing reference-style link [" + id + "]",
      );
    }
  }
}

const markdownFiles = trackedMarkdownFiles();
const contents = new Map();
for (const file of markdownFiles) {
  const text = await readFile(file, "utf8");
  contents.set(file, text);

  if (!file.endsWith("_ZH.md")) {
    const withoutReviewedExceptions = text.replace(
      /<!-- allow-han:start -->[\s\S]*?<!-- allow-han:end -->/g,
      "",
    );
    if (/\p{Script=Han}/u.test(withoutReviewedExceptions)) {
      errors.push(
        `${relative(file)}: authoritative English contains Han characters`,
      );
    }
  }
}

const anchorsByFile = new Map(
  [...contents].map(([file, text]) => [file, headingAnchors(text)]),
);
for (const [file, text] of contents) {
  checkLocalLinks(file, text, anchorsByFile);
}

for (const [followerFile, followerText] of contents) {
  if (!followerFile.endsWith("_ZH.md")) continue;
  const englishFile = followerFile.replace(/_ZH\.md$/, ".md");
  if (!contents.has(englishFile)) {
    errors.push(
      relative(followerFile) + ": follower has no tracked English authority",
    );
    continue;
  }
  const expectedSource = "(./" + path.basename(englishFile) + ")";
  if (!followerText.includes(expectedSource)) {
    errors.push(
      relative(followerFile) +
        ": follower must identify its English source with " +
        expectedSource,
    );
  }
}

for (const [englishFile, englishText] of contents) {
  if (englishFile.endsWith("_ZH.md")) continue;
  const followerFile = englishFile.replace(/\.md$/, "_ZH.md");
  const followerText = contents.get(followerFile);
  if (followerText === undefined) continue;

  const label = `${relative(englishFile)} <-> ${relative(followerFile)}`;
  compareSets(`${label} IDs`, stableIds(englishText), stableIds(followerText));
  compareMaps(
    `${label} decision states`,
    decisionStates(englishText),
    decisionStates(followerText),
  );
  compareMaps(
    `${label} task states`,
    taskStates(englishText),
    taskStates(followerText),
  );
  compareMaps(
    `${label} issue states`,
    issueStates(englishText),
    issueStates(followerText),
  );
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log("Documentation policy checks passed.");
}
