import { test, expect } from "@playwright/test";
import setupMockLogin from "./util/setupMockLogin";

test("File Upload Page Test", async ({ page }) => {
  await setupMockLogin(page);

  // go to File Upload Page
  await page.goto("./FileUploadPage");

  // Check if the page has all expected content
  await expect(page.getByRole("navigation")).toBeVisible();

  await expect(
    page
      .locator("div")
      .filter({ hasText: "Step 1: Drag and drop your" })
      .nth(3),
  ).toBeVisible();
  await expect(page.locator("#root")).toContainText(
    "section on the right. You can select the file you want to process and click the process button. Once you have processed your data it will be saved. You do not need to process it again. Click",
  );

  await expect(page.getByText("Select File Type: FitbitApple")).toBeVisible();
  await expect(page.getByLabel("Fitbit")).not.toBeChecked();
  await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

  await expect(page.locator("section")).toBeVisible();
  await expect(page.locator("section")).toContainText(
    "Drop files here, or Open File Dialog",
  );

  await expect(page.getByRole("heading")).toContainText("Accepted Files");
  await expect(page.getByRole("button", { name: "Upload" })).toBeVisible();

  // selecting Fitbit data
  await page.getByLabel("Fitbit").check();
  await expect(page.getByLabel("Fitbit")).toBeChecked();
  await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

  // selecting Apple Watch data
  await page.getByLabel("Apple Watch").check();
  await expect(page.getByLabel("Fitbit")).not.toBeChecked();
  await expect(page.getByLabel("Apple Watch")).toBeChecked();
});
