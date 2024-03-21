import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";

test.beforeEach(async ({ page }) => {
    await setupLogin(page);
});

test("T2.6 Navbar Test", async ({ page }) => {
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

    await page.getByRole("link", { name: "PREDICTED FILES", exact: true }).click();
    await expect(page).toHaveURL("./PredictedDataPage");

    const PredictedPage = page.locator("#root");

    await page.getByTestId("profile").click();
    await expect(page).toHaveURL("./");

    // check that the user was actually logged out
    await expect(page.getByRole("link", { name: "FILE UPLOAD" })).toHaveCount(0);
});

test.describe("T.90 individual Navbar tests from homepage", () => {
    test("Homepage to File Upload", async ({ page }) => {
        await page.goto("./");
        await page.getByRole("link", { name: "FILE UPLOAD" }).click();
        await expect(page).toHaveURL("./FileUploadPage");
    });

    test("Homepage to Processed Files", async ({ page }) => {
        await page.goto("./");
        await page.getByRole("link", { name: "PROCESSED FILES" }).click();
        await expect(page).toHaveURL("./ProcessedDataPage");
    });

    test("Homepage to Predicted Files", async ({ page }) => {
        await page.goto("./");
        await page.getByRole("link", { name: "PREDICTED FILES", exact: true }).click();
        await expect(page).toHaveURL("./PredictedDataPage");
    });

    test("Homepage to Logout", async ({ page }) => {
        await page.goto("./");
        await page.getByTestId("profile").click();
        await expect(page.getByRole("link", { name: "profileLogo" })).toHaveCount(0);
    });
});
