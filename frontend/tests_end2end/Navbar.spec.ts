import { test, expect } from "@playwright/test";

test("Navbar Test", async ({ page }) => {
  // Navigate to the website
  await page.goto("./");

  // Check if correct landing page
  await expect(page).toHaveURL("./");
  // extra checks to double check that it is the home page
  await expect(page.locator("#root")).toContainText("BEAP ENGINE");
  await expect(page.locator("h6")).toContainText(
    "Accurately Process Your Fitness Data",
  );

  // check the NavBar will direct users to the correct pages
  await page.getByRole("link", { name: "FILE UPLOAD" }).click();
  await expect(page).toHaveURL("./FileUpload");

  await page.getByRole("link", { name: "PROCESSED FILES" }).click();
  await expect(page).toHaveURL("./ProcessedDataPage");

  await page
    .getByRole("link", { name: "PREDICTED FILES", exact: true })
    .click();
  await expect(page).toHaveURL("./PredictedDataPage");

  await page.getByRole("link", { name: "LOGOUT" }).click();
  await expect(page).toHaveURL("./Logout");

  // checking that the navbar can direct to the home page
  await page.getByRole("link", { name: "HOME" }).click();
  await expect(page).toHaveURL("./");
});
