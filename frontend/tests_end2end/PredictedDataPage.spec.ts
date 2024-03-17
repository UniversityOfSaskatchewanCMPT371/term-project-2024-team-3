import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";

test("Predicted Data Page Test", async ({ page }) => {
    await setupLogin(page);
    // go to Predicted Data Page
    await page.goto("./PredictedDataPage");

    // Check if the page has all expected content

    await expect(page.getByRole("navigation")).toBeVisible();

    await expect(page.locator("#root")).toContainText(
        "Step 3 - Predicted data files: On this page, you can download your new data files with both the raw Apple Watch or Fitbit data, the features we use for our machine learning models, and the predicted activity for each minute of your data.",
    );

    await expect(page.getByRole("heading", { name: "Files:" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download File" })).toBeVisible();

    await expect(page.locator("#root")).toContainText(
        "If you want to upload different files, go back to the file upload page. You can also click on individual steps to rerun a different machine learning model if you want.",
    );
});
