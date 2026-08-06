import { expect, test } from "@playwright/test";

const WEB_ORIGIN = "http://localhost:43000";
const EMAIL_LABEL = /^Email\s*\*?$/;
const PASSWORD_LABEL = /^Password\s*\*?$/;

test("keeps an API outage distinct from an unauthenticated session", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(`${WEB_ORIGIN}/dashboard`);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Session unavailable",
    }),
  ).toBeVisible();

  await page.goto("/route-that-does-not-exist");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  await expect(
    page.getByRole("alert").filter({
      hasText: "We could not verify your session, so you were not redirected.",
    }),
  ).toBeVisible();
  await expect(page).toHaveURL(`${WEB_ORIGIN}/route-that-does-not-exist`);

  await page.goto("/login");
  await page.getByLabel(EMAIL_LABEL).fill("outage@example.com");
  await page.getByLabel(PASSWORD_LABEL).fill("legacy password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(
    page.getByRole("alert").filter({
      hasText: "The authentication service is unavailable. Try again.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled();
});
