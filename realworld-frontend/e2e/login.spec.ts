import { expect, test } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("nikokav7@gmail.com");

  await page.getByLabel("Password").fill("admin");

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click();

  await expect(page).toHaveURL("/");

  await expect(page.getByText(/your feed/i)).toBeVisible();
});
