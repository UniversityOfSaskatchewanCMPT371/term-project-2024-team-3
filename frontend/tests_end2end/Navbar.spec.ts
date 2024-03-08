import { test, expect } from "@playwright/test";
import { setupMockLogin } from "./utils";
// import exp from "constants";
// import { title } from "process";

test("Navbar Test", async ({ page }) => {
    await setupMockLogin(page);
    // Navigate to the website
    await page.goto("./");

    // Check if correct landing page
    await expect(page).toHaveURL("./");
    // extra checks to double check that it is the home page

    const Title = page.locator("#root");

    await expect(Title).toContainText("BEAP ENGINE");

    const subTitle = page.locator("h6");

    await expect(subTitle).toContainText("Accurately Process Your Fitness Data");

    // check the NavBar will direct users to the correct pages
    await page.getByRole("link", { name: "FILE UPLOAD" }).click();
    await expect(page).toHaveURL("./FileUploadPage");

    await page.getByRole("link", { name: "PROCESSED FILES" }).click();
    await expect(page).toHaveURL("./ProcessedDataPage");

    // make sure that it is on the right page
    const ProcessedPage = page.locator("#root");

    await expect(ProcessedPage).toContainText("Step 2 - Data prediction and download:");

    await page.getByRole("link", { name: "PREDICTED FILES", exact: true }).click();
    await expect(page).toHaveURL("./PredictedDataPage");

    const PredictedPage = page.locator("#root");

    await expect(PredictedPage).toContainText("Step 3 - Predicted data files:");

    await page.getByRole("link", { name: "LOGOUT" }).click();
    await expect(page).toHaveURL("./Logout");

    const LogOutPage = page.locator("#root");

    await expect(LogOutPage).toContainText("This is the Logout page");

    // checking that the navbar can direct to the home page
    await page.getByRole("link", { name: "HOME" }).click();
    await expect(page).toHaveURL("./");
});
