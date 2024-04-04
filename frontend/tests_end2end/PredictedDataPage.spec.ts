import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";

test("T2.10 Predicted Data Page Test", async ({ page }) => {
    await setupLogin(page);
    // go to Predicted Data Page
    await page.goto("./predicted-data");

    // Check if the page has all expected content

    await expect(page.getByRole("navigation")).toBeVisible();

    await expect(page.locator("label").filter({ hasText: "FitBit" })).toBeVisible();
    await expect(page.locator("label").filter({ hasText: "AppleWatch" })).toBeVisible();
    await expect(page.getByTestId("Download_Button")).toBeVisible();
    await expect(page.getByTestId("popupButton")).toBeVisible();

    await page.getByLabel("FitBit").check();
    await expect(page.getByLabel("FitBit")).toBeChecked();
    await expect(page.getByLabel("AppleWatch")).not.toBeChecked();

    await page.getByLabel("AppleWatch").check();
    await expect(page.getByLabel("FitBit")).not.toBeChecked();
    await expect(page.getByLabel("AppleWatch")).toBeChecked();
});
