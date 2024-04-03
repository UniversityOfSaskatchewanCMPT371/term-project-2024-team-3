import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";

test("T2.9 Processed Files Page Test", async ({ page }) => {
    await setupLogin(page);

    // go to File Upload Page
    await page.goto("./processed-data");

    // Check if the page has all expected content
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByTestId("popupButton")).toContainText("? Help");

    await expect(page.getByText("SVMRandom ForestDecision Tree")).toBeVisible();
    await expect(page.getByRole("button", { name: "Predict File" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download File" })).toBeVisible();

    await expect(page.getByText("SVM")).toBeVisible();
    await expect(page.getByText("Random Forest")).toBeVisible();
    await expect(page.getByText("Decision Tree")).toBeVisible();

    // test the type of ML Algorithms selection
    await expect(page.getByLabel("SVM")).toBeChecked();
    await expect(page.getByLabel("Random Forest")).not.toBeChecked();
    await expect(page.getByLabel("Decision Tree")).not.toBeChecked();

    await page.getByLabel("Random Forest").check();
    await expect(page.getByLabel("SVM")).not.toBeChecked();
    await expect(page.getByLabel("Random Forest")).toBeChecked();
    await expect(page.getByLabel("Decision Tree")).not.toBeChecked();

    await page.getByLabel("Decision Tree").check();
    await expect(page.getByLabel("SVM")).not.toBeChecked();
    await expect(page.getByLabel("Random Forest")).not.toBeChecked();
    await expect(page.getByLabel("Decision Tree")).toBeChecked();
});
