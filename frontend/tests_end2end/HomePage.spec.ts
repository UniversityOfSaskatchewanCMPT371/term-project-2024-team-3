import { test, expect } from "@playwright/test";

test("T2.7 Home Page Test", async ({ page }) => {
    // go to home page
    await page.goto("./");

    // Check if the page has all expected content

    await expect(page.getByRole("img", { name: "Beap Logo" })).toBeVisible();

    await expect(page.locator("#root")).toContainText("BEAP ENGINE");

    await expect(page.locator("h6")).toContainText("Unleashing The Power Of Your Fitness Data");

    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();

    await expect(page.locator("#desc")).toContainText("How To Contribute Data");

    await expect(page.getByRole("link", { name: "Apple Watch Extraction" })).toBeVisible();

    await expect(
        page.getByRole("link", {
            name: "Fitbit Extraction Protocol",
        }),
    ).toBeVisible();

    await expect(page.locator("#desc")).toContainText(
        "BEAP Engine is a research project developed by Dr. Daniel Fuller and the Built Environment and Active Populations (BEAP) Lab. The purpose of this study is to collect and analyze large volumes of Apple Watch and Fitbit data and develop methods to standardize across devices. We provide you with a CSV file of your data and give you detailed information about sedentary behavior, and moderate to vigorous activity based on our machine-learning methods. This project is approved by the Memorial University Interdisciplinary Committee on Ethics in Human Research ( ICEHR # 20210162-HK ).",
    );

    await expect(page.getByRole("img", { name: "Beap engine overview" })).toBeVisible();

    await expect(page.getByRole("link", { name: "About Us" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
    await expect(page.getByText("copyright2024 BEAP Lab")).toBeVisible();
});
