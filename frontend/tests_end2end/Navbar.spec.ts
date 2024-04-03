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
    await expect(page.locator("h6")).toContainText("Unleashing The Power Of Your Fitness Data");

    // check the NavBar will direct users to the correct pages
    await page.getByRole("link", { name: "FILE UPLOAD" }).click();
    await expect(page).toHaveURL("./file-upload");

    await page.getByRole("link", { name: "PROCESSED FILES" }).click();
    await expect(page).toHaveURL("./processed-data");

    await page.getByRole("link", { name: "PREDICTED FILES", exact: true }).click();
    await expect(page).toHaveURL("./predicted-data");

    await page.getByTestId("profile").click();
    await expect(page.getByRole("menuitem", { name: "My account" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Logout" })).toBeVisible();
    await page.getByRole("menuitem", { name: "My account" }).click();
    await expect(page).toHaveURL("./profile");

    await page.getByTestId("profile").click();
    await expect(page.getByRole("menuitem", { name: "My account" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Logout" })).toBeVisible();
    await page.getByRole("menuitem", { name: "Logout" }).click();
    await expect(page).toHaveURL("./");

    // check that the user was actually logged out
    await expect(page.getByRole("link", { name: "FILE UPLOAD" })).toHaveCount(0);
});

test.describe("T4.90 individual Navbar tests from homepage", () => {
    test("Homepage to File Upload", async ({ page }) => {
        await page.goto("./");
        await page.getByRole("link", { name: "FILE UPLOAD" }).click();
        await expect(page).toHaveURL("./file-upload");
    });

    test("Homepage to Processed Files", async ({ page }) => {
        await page.goto("./");
        await page.getByRole("link", { name: "PROCESSED FILES" }).click();
        await expect(page).toHaveURL("./processed-data");
    });

    test("Homepage to Predicted Files", async ({ page }) => {
        await page.goto("./");
        await page.getByRole("link", { name: "PREDICTED FILES", exact: true }).click();
        await expect(page).toHaveURL("./predicted-data");
    });

    test("Homepage to Profile", async ({ page }) => {
        await page.goto("./");
        await page.getByTestId("profile").click();
        await page.getByRole("menuitem", { name: "My account" }).click();
        await expect(page).toHaveURL("./profile");
    });

    test("Homepage to Logout", async ({ page }) => {
        await page.goto("./");
        await page.getByTestId("profile").click();
        await page.getByRole("menuitem", { name: "Logout" }).click();
        await expect(page).toHaveURL("./");
        await expect(page.getByRole("link", { name: "profileLogo" })).toHaveCount(0);
    });
});
