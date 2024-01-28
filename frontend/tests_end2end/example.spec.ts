// Initial code for tests (given by Playwright installation)
import { test, expect } from "@playwright/test";

// test("has title", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});

// Our tests

// test("TID 1.7 Navigation Bar to file Upload Page", async ({ page }) => {
//   // To be changed for the real URL of the page
//   await page.goto("http://localhost:3000/");

//   await page.getByRole("link", { name: "FILE UPLOAD" }).click();

//   await expect(page.getByText("FileDropZone")).toBeVisible();
// });
