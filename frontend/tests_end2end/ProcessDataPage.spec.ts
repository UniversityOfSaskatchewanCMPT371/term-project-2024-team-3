// import { test, expect } from "@playwright/test";
// import setupMockLogin from "./util/setupMockLogin";

// test("Processed Files Page Test", async ({ page }) => {
//   await setupMockLogin(page);

//   // go to File Upload Page
//   await page.goto("./ProcessedDataPage");

//   // Check if the page has all expected content
//   await expect(page.getByRole("navigation")).toBeVisible();
//   await expect(page.locator("#root")).toContainText(
//     "Step 2 - Data prediction and download: In this step you can either download the.csvof your Apple Watch or Fitbit data or, use our machine learning methods to predict lying, sitting, and walking at difference intensities. Select the file you want to predict, select the machine learning model for the prediction (we recommend Random Forrest) and click the Predict File button. Once prediction is complete, move to the predicted files page.",
//   );
//   await expect(page.getByText("SVMRandom ForestDecission Tree")).toBeVisible();
//   await expect(
//     page.getByRole("button", { name: "Predict File" }),
//   ).toBeVisible();
//   await expect(
//     page.getByRole("button", { name: "Download File" }),
//   ).toBeVisible();
//   await expect(
//     page.getByRole("link", { name: "Go To Predicted Files" }),
//   ).toBeVisible();
//   await expect(page.getByRole("radiogroup")).toContainText("SVM");
//   await expect(page.getByRole("radiogroup")).toContainText("Random Forest");
//   await expect(page.getByRole("radiogroup")).toContainText("Decission Tree");

//   // test the type of ML Algorithms selection
//   await expect(page.getByLabel("SVM")).toBeChecked();
//   await expect(page.getByLabel("Random Forest")).not.toBeChecked();
//   await expect(page.getByLabel("Decission Tree")).not.toBeChecked();

//   await page.getByLabel("Random Forest").check();
//   await expect(page.getByLabel("SVM")).not.toBeChecked();
//   await expect(page.getByLabel("Random Forest")).toBeChecked();
//   await expect(page.getByLabel("Decission Tree")).not.toBeChecked();

//   await page.getByLabel("Decission Tree").check();
//   await expect(page.getByLabel("SVM")).not.toBeChecked();
//   await expect(page.getByLabel("Random Forest")).not.toBeChecked();
//   await expect(page.getByLabel("Decission Tree")).toBeChecked();

//   // test go to predicted file button
//   await page.getByRole("link", { name: "Go To Predicted Files" }).click();
//   await expect(page).toHaveURL("./PredictedDataPage");
// });
