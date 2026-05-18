import { expect, test } from "@playwright/test";
import { login } from "./utils/auth";

test("logged in user can create an article", async ({ page }) => {
  await login(page);

  await page.goto("/editor");

  const uniqueTitle = `E2E Test Article ${Date.now()}`;

  await page.getByLabel(/title/i).fill(uniqueTitle);
  await page.getByLabel(/description/i).fill("Created by Playwright test.");
  await page
    .getByLabel(/body/i)
    .fill("This article was created during an E2E test.");

  await page.getByLabel(/tags/i).fill("e2e");
  await page.keyboard.press("Enter");

  await page.getByRole("button", { name: /publish article/i }).click();

  await expect(page.getByRole("heading", { name: uniqueTitle })).toBeVisible();

  await expect(
    page.getByText("This article was created during an E2E test."),
  ).toBeVisible();

  await expect(page).toHaveURL(/\/article\//);
});
