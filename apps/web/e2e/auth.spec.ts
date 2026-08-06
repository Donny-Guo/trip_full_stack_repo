import { randomUUID } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const TEST_PASSWORD = "TripDemo9@Qz";
const WEB_ORIGIN = "http://localhost:43000";
const EMAIL_LABEL = /^Email\s*\*?$/;
const PASSWORD_LABEL = /^Password\s*\*?$/;

async function expectNoSeriousAccessibilityViolations(
  page: Page,
): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(
    results.violations.filter(
      ({ impact }) => impact === "critical" || impact === "serious",
    ),
  ).toEqual([]);
}

test("protects Dashboard when no session exists", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(`${WEB_ORIGIN}/login?returnTo=%2Fdashboard`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
});

test("rejects an invalid cookie without a redirect loop", async ({
  context,
  page,
}) => {
  await context.addCookies([
    {
      name: "trip_access_dev",
      value: "invalid-test-token",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(`${WEB_ORIGIN}/login?returnTo=%2Fdashboard`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
});

test("sign-up, restore, logout, invalid login, and valid login", async ({
  context,
  page,
}) => {
  const email = `e2e-${randomUUID()}@example.com`;

  await page.goto("/sign-up");
  await expectNoSeriousAccessibilityViolations(page);
  await page.getByLabel(EMAIL_LABEL).fill(email);
  await page.getByLabel(PASSWORD_LABEL).fill(TEST_PASSWORD);

  const signUpResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/auth/sign-up") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Create account" }).click();
  const signUpResponse = await signUpResponsePromise;

  expect(signUpResponse.status()).toBe(201);
  expect(signUpResponse.headers()["cache-control"]).toContain("no-store");
  await expect(page).toHaveURL(`${WEB_ORIGIN}/dashboard`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" }),
  ).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);

  const cookieMetadata = (await context.cookies()).map(
    ({ domain, expires, httpOnly, name, path, sameSite, secure }) => ({
      domain,
      expires,
      httpOnly,
      name,
      path,
      sameSite,
      secure,
    }),
  );
  const accessCookie = cookieMetadata.find(
    ({ name }) => name === "trip_access_dev",
  );
  if (accessCookie === undefined) {
    throw new Error("Expected access-cookie metadata.");
  }
  expect(accessCookie).toMatchObject({
    domain: "localhost",
    httpOnly: true,
    name: "trip_access_dev",
    path: "/",
    sameSite: "Lax",
    secure: false,
  });
  const nowInSeconds = Date.now() / 1_000;
  expect(accessCookie.expires).toBeGreaterThan(nowInSeconds + 780);
  expect(accessCookie.expires).toBeLessThanOrEqual(nowInSeconds + 930);
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    "trip_access_dev",
  );
  expect(
    await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    })),
  ).toEqual({ local: [], session: [] });

  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" }),
  ).toBeVisible();

  await page.goto("/route-that-does-not-exist");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Redirecting to dashboard",
  );
  await expect(page).toHaveURL(`${WEB_ORIGIN}/dashboard`, {
    timeout: 7_000,
  });

  await page.goto("/sign-up");
  await page.getByLabel(EMAIL_LABEL).fill(email);
  await page.getByLabel(PASSWORD_LABEL).fill(TEST_PASSWORD);
  const duplicateResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/auth/sign-up") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Create account" }).click();
  const duplicateResponse = await duplicateResponsePromise;
  expect(duplicateResponse.status()).toBe(409);
  expect(duplicateResponse.headers()["cache-control"]).toContain("no-store");
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "An account with that email already exists." }),
  ).toBeVisible();

  await page.goto("/dashboard");
  const logoutResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/auth/logout") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Log out" }).click();
  const logoutResponse = await logoutResponsePromise;
  expect(logoutResponse.status()).toBe(204);
  expect(logoutResponse.headers()["cache-control"]).toContain("no-store");
  await expect(page).toHaveURL(`${WEB_ORIGIN}/login`);
  expect(
    (await context.cookies()).some(({ name }) => name === "trip_access_dev"),
  ).toBe(false);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(`${WEB_ORIGIN}/login?returnTo=%2Fdashboard`);

  await page.goto("/login?returnTo=https%3A%2F%2Fevil.example");
  expect(new URL(page.url()).searchParams.get("returnTo")).toBe(
    "https://evil.example",
  );

  await page.getByLabel(EMAIL_LABEL).fill(email);
  await page.getByLabel(PASSWORD_LABEL).fill("WrongPassword9@");
  const invalidLoginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/auth/login") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Sign in" }).click();
  const invalidLoginResponse = await invalidLoginResponsePromise;
  expect(invalidLoginResponse.status()).toBe(401);
  expect(invalidLoginResponse.headers()["cache-control"]).toContain("no-store");
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Email or password is invalid." }),
  ).toBeVisible();

  await page.getByLabel(PASSWORD_LABEL).fill(TEST_PASSWORD);
  const validLoginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/auth/login") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Sign in" }).click();
  const validLoginResponse = await validLoginResponsePromise;
  expect(validLoginResponse.status()).toBe(200);
  expect(validLoginResponse.headers()["cache-control"]).toContain("no-store");
  await expect(page).toHaveURL(`${WEB_ORIGIN}/dashboard`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" }),
  ).toBeVisible();
});

test("prevents a client-invalid password before sending a request", async ({
  page,
}) => {
  let signUpRequests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/v1/auth/sign-up")) signUpRequests += 1;
  });

  await page.goto("/sign-up");
  await page.getByLabel(EMAIL_LABEL).fill("person@example.com");
  await page.getByLabel(PASSWORD_LABEL).fill("short");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(
    page.getByText("Meet every password requirement."),
  ).toBeVisible();
  expect(signUpRequests).toBe(0);
});

test("redirects an unauthenticated 404 to sign in", async ({ page }) => {
  await page.goto("/route-that-does-not-exist");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Redirecting to sign in",
  );
  await expect(page).toHaveURL(`${WEB_ORIGIN}/login`, {
    timeout: 7_000,
  });
});
