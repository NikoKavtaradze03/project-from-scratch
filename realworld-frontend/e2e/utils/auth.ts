import { expect, type Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/login");

  await page.getByLabel("Email").fill("nikokav7@gmail.com");

  await page.getByLabel("Password").fill("admin");

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click();

  await expect(page).toHaveURL("/");
}
