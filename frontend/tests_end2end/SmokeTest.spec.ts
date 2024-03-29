import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";

test("smoke test @smoke", async ({ page }) => {
    //homepage
    await page.goto("./");
    const Title = page.locator("#root");
    await expect(Title).toContainText("BEAP ENGINE");
    await expect(page.locator("h6")).toContainText("Unleashing The Power Of Your Fitness Data");
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();

    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.locator("#root")).toContainText("Sign Up");
    await expect(page.getByTestId("policyAgreementLink")).toContainText(
        "I agree to the terms and privacy policy",
    );

    await expect(page.getByTestId("submitButton")).toBeVisible();

    await page.getByTestId("navigateSignIn").click();
    await expect(page.locator("#root")).toContainText("Sign In");
    await expect(page.locator("#root")).toContainText("Log into your existing BEAPENGINE account");

    await expect(page.getByTestId("submitButton")).toBeVisible();
    await expect(page.getByText("No account?Get started for freeSign Up")).toBeVisible();
    await expect(page.getByTestId("signupNavigate")).toBeVisible();
    await page.getByTestId("signupNavigate").click();
    await expect(page.locator("#root")).toContainText("Sign Up");

    await page.goto("./");

    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.locator("#root")).toContainText("Sign In");
    await expect(page.locator("#root")).toContainText("Log into your existing BEAPENGINE account");

    await setupLogin(page);

    await page.getByRole("link", { name: "FILE UPLOAD" }).click();
    await expect(page.getByTestId("popupButton")).toBeVisible();
    await expect(page.locator("#root")).toContainText("Upload File");
    await expect(page.locator("#root")).toContainText("Drop items here or Browse Files");
    await expect(page.getByLabel("Fitbit", { exact: true })).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();
    await expect(page.getByText("Fitbit - 2Tue, 26 Mar 2024,")).toBeVisible();
    await expect(page.getByText("AppleWatch - 5Tue, 26 Mar")).toBeVisible();
    await expect(page.getByTestId("processBtn")).toBeDisabled();
    await page.getByLabel("Fitbit -").check();
    await expect(page.getByTestId("processBtn")).toBeEnabled();

    await page.getByRole("link", { name: "PROCESSED FILES" }).click();
    await expect(page.getByTestId("popupButton")).toBeVisible();
    await expect(page.getByLabel("SVM")).toBeChecked();
    await expect(page.locator("#root")).toContainText("FitBit 62024/03/26");
    await expect(page.locator("#root")).toContainText("AppleWatch 72024/03/26");
    await expect(page.getByTestId("Predict_Button")).toBeVisible();
    await expect(page.getByTestId("Download_Button")).toBeVisible();

    await page.getByRole("link", { name: "PREDICTED FILES" }).click();
    await expect(page.getByTestId("popupButton")).toBeVisible();
    await expect(page.getByRole("list")).toContainText("fitbit - 8Tue, 26 Mar 2024, 07:22:08 PM");

    await expect(page.getByRole("list")).toContainText(
        "applewatch - 9Tue, 26 Mar 2024, 07:22:18 PM",
    );
});
