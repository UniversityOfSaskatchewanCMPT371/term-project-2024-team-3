import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";

test("smoke test @smoke", async ({ page }) => {
    // Navigate to the root page
    await page.goto("./");

    const rootText = await page.locator("#root").innerText();
    if (rootText.includes("Website Under Maintenance")) {
        await expect(page.locator("h3")).toContainText("Website Under Maintenance");

        // Use a locator that matches the div with a class containing 'message'
        const messageLocator = page.locator("div[class*='message']");
        await expect(messageLocator).toContainText(
            "We are currently doing major upgrades to the BeapEngine to accommodate changes to the data format for Fitbit devices",
        );
        await expect(messageLocator).toContainText("Please check back soon!");
    } else {
        await expect(page.locator("#root")).toContainText("BEAP ENGINE");
        await expect(page.locator("h6")).toContainText("Unleashing The Power Of Your Fitness Data");
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();

        // homepage -> signup page, check that signup page has
        await page.getByRole("button", { name: "Sign Up" }).click();
        await expect(page.locator("#root")).toContainText("Sign Up");
        await expect(page.getByTestId("policyAgreementLink")).toContainText(
            "I agree to the terms and privacy policy",
        );
        await expect(page.getByTestId("submitButton")).toBeVisible();

        // signup page -> login page, and check that login page has expected elements
        await page.getByTestId("navigateSignIn").click();
        await expect(page.locator("#root")).toContainText("Sign In");
        await expect(page.locator("#root")).toContainText(
            "Log into your existing BEAPENGINE account",
        );

        await expect(page.getByTestId("submitButton")).toBeVisible();
        await expect(page.getByText("No account?Get started for freeSign Up")).toBeVisible();
        await expect(page.getByTestId("signupNavigate")).toBeVisible();
        // login -> signup
        await page.getByTestId("signupNavigate").click();
        await expect(page.locator("#root")).toContainText("Sign Up");

        // check that login button can be pressed from homepage
        await page.goto("./");
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page.locator("#root")).toContainText("Sign In");
        await expect(page.locator("#root")).toContainText(
            "Log into your existing BEAPENGINE account",
        );

        // Perform Login
        await setupLogin(page);

        // navigate to the homepage
        await expect(page.getByRole("link", { name: "beapLogo" })).toBeVisible();
        await page.getByRole("link", { name: "beapLogo" }).click();
        await expect(page.locator("#root")).toContainText("BEAP ENGINE");
        await expect(page.locator("h6")).toContainText("Unleashing The Power Of Your Fitness Data");

        // File Upload Page
        await page.getByRole("link", { name: "FILE UPLOAD" }).click();
        await expect(page.getByTestId("popupButton")).toBeVisible();
        await expect(page.locator("#root")).toContainText("Upload File");
        await expect(page.locator("#root")).toContainText("Drop items here or Browse Files");
        await expect(page.getByLabel("Fitbit", { exact: true })).toBeChecked();
        await expect(page.getByLabel("Apple Watch")).not.toBeChecked();
        await expect(page.getByText("Fitbit - 2")).toBeVisible();
        await expect(page.getByText("AppleWatch - 5")).toBeVisible();
        await expect(page.getByTestId("processBtn")).toBeDisabled();
        await page.getByLabel("Fitbit - 2").check();
        await expect(page.getByTestId("processBtn")).toBeEnabled();

        // Processed Files Page
        await page.getByRole("link", { name: "PROCESSED FILES" }).click();
        await expect(page.getByTestId("popupButton")).toBeVisible();
        await expect(page.getByLabel("SVM")).toBeChecked();
        await expect(page.locator("#root")).toContainText("FitBit 6");
        await expect(page.locator("#root")).toContainText("AppleWatch 7");
        await expect(page.getByTestId("Predict_Button")).toBeVisible();
        await expect(page.getByTestId("Download_Button")).toBeVisible();

        // Predicted Files Page
        await page.getByRole("link", { name: "PREDICTED FILES" }).click();
        await expect(page.getByTestId("popupButton")).toBeVisible();
        await expect(page.getByRole("radiogroup")).toContainText("FitBit 8");
        await expect(page.getByRole("radiogroup")).toContainText("AppleWatch 9");

        // go to profile
        await expect(page.getByRole("button", { name: "profileLogo" })).toBeVisible();
        await page.getByRole("button", { name: "profileLogo" }).click();
        await expect(page.getByRole("menuitem", { name: "My account" })).toBeVisible();
        await expect(page.getByRole("menuitem", { name: "Logout" })).toBeVisible();
        await page.getByRole("menuitem", { name: "My account" }).click();
        await expect(page.locator("#root")).toContainText("Manage your account");
        await expect(page.locator("h1")).toContainText("Your account details");
        await expect(page.locator("#root")).toContainText("First Name:TestLast Name:Tester");

        // logout
        await page.getByRole("button", { name: "profileLogo" }).click();
        await page.getByRole("menuitem", { name: "Logout" }).click();

        // check that logout worked
        await page.goto("./");
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
    }
});
