/// <reference lib="dom"/>
/* eslint-disable @typescript-eslint/no-shadow */
import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";
import { appleWatchData, fitbitData } from "./testDataBuffers";

test("File Upload Page Test", async ({ page }) => {
    await setupLogin(page);

    // go to File Upload Page
    await page.goto("./FileUploadPage");

    // Check if the page has all expected content
    await expect(page.getByRole("navigation")).toBeVisible();

    await expect(page.getByText("Select File Type: FitbitApple")).toBeVisible();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    await expect(page.locator("section")).toBeVisible();
    await expect(page.getByText("Drop files here, or Click")).toBeVisible();

    await expect(page.getByRole("heading")).toContainText("Accepted Files");
    // await expect(page.getByRole("button", { name: "Upload" })).toBeVisible();

    // selecting Apple Watch data
    await page.getByLabel("Apple Watch").check();
    await expect(page.getByLabel("Fitbit")).not.toBeChecked();
    await expect(page.getByLabel("Apple Watch")).toBeChecked();

    // selecting Fitbit data
    await page.getByLabel("Fitbit").check();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    await expect(page.getByTestId("dropZone")).toBeVisible();
});

test("Test Uploading Fitbit Files", async ({ page }) => {
    await setupLogin(page);

    // go to File Upload Page
    await page.goto("./FileUploadPage");

    // Should be default fitbit selector
    await page.getByLabel("Fitbit").check();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    await expect(page.getByTestId("dropZone")).toBeVisible();

    // Does not matter what is inside the file!
    const buffer = fitbitData;

    const filesData = [
        {
            name: "wat.json",
            data: buffer,
            mimeType: "application/json",
        },
        {
            name: "lightly_active_minutes-2018-02-15.json",
            data: buffer,
            mimeType: "application/json",
        },
        {
            name: "lightly_active_minutes-2018-05-15.json",
            data: buffer,
            mimeType: "application/json",
        },
        {
            name: "lightly_active_minutes-2016-02-15.json",
            data: buffer,
            mimeType: "application/json",
        },
        { name: "whatMinutes-2016-02-15.json", data: buffer, mimeType: "application/json" },
        {
            name: "waowehaiwehwuioaehuio-2016-02-15.json",
            data: buffer,
            mimeType: "application/json",
        },
        {
            name: "1_export.xml",
            data: buffer,
            mimeType: "application/xml",
        },
    ];

    // Create the DataTransfer and File
    const dataTransfer = await page.evaluateHandle((filesData) => {
        const dt = new DataTransfer();

        filesData.forEach((fileData) => {
            const file = new File([fileData.data.toString("hex")], fileData.name, {
                type: fileData.mimeType,
            });
            dt.items.add(file);
        });

        return dt;
    }, filesData);

    // Now dispatch
    await page.dispatchEvent("[data-testid='dropZone']", "drop", { dataTransfer });

    const div2016 = page.locator(`[data-testid='2016']`);

    await div2016.filter({ hasText: "2016" }).first().isVisible();
    await div2016.filter({ hasText: "3 files" }).first().isVisible();
    await div2016.filter({ hasText: "Upload" }).first().isVisible();

    const div2018 = page.locator(`[data-testid='2018']`);

    await div2018.filter({ hasText: "2018" }).first().isVisible();
    await div2018.filter({ hasText: "2 files" }).first().isVisible();
    await div2018.filter({ hasText: "Upload" }).first().isVisible();

    // Upload 2018
    await page.getByTestId("2018-btn").click();
    // Should be gone after upload
    await expect(page.getByText("2018")).not.toBeVisible();
    await expect(page.getByText("2 files")).not.toBeVisible();
    await expect(page.getByTestId("2018-btn")).not.toBeVisible();

    const yearlessFitbit = page.locator(`[data-testid='Yearless Fitbit Export']`);

    await yearlessFitbit.filter({ hasText: "Yearless Fitbit Export" }).first().isVisible();
    await yearlessFitbit.filter({ hasText: "1 files" }).first().isVisible();
    await yearlessFitbit.filter({ hasText: "Upload" }).first().isVisible();

    // Apple watch data should not be accepted
    await expect(page.getByText("Apple Export")).not.toBeVisible();

    // Should delete Files after switching button
    // selecting Apple Watch data
    await page.getByLabel("Apple Watch").check();
    await expect(page.getByLabel("Fitbit")).not.toBeChecked();
    await expect(page.getByLabel("Apple Watch")).toBeChecked();

    await expect(page.getByText("2016")).not.toBeVisible();
    await expect(page.getByText("Yearless Fitbit Export")).not.toBeVisible();
});

test("Test Uploading Applewatch Files", async ({ page }) => {
    await setupLogin(page);

    // go to File Upload Page
    await page.goto("./FileUploadPage");

    // Should be default fitbit selector
    await page.getByLabel("Fitbit").check();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    // selecting Apple Watch data
    await page.getByLabel("Apple Watch").check();
    await expect(page.getByLabel("Fitbit")).not.toBeChecked();
    await expect(page.getByLabel("Apple Watch")).toBeChecked();

    await expect(page.getByTestId("dropZone")).toBeVisible();

    // Does not matter what is inside the file!
    const buffer = appleWatchData;

    const filesData = [
        {
            name: "lightly_active_minutes-2018-02-15.json",
            data: buffer,
            mimeType: "application/json",
        },
        {
            name: "1_export.xml",
            data: buffer,
            mimeType: "application/xml",
        },
        {
            name: "2_export.xml",
            data: buffer,
            mimeType: "application/xml",
        },
    ];

    // Create the DataTransfer and File
    const dataTransfer = await page.evaluateHandle((filesData) => {
        const dt = new DataTransfer();

        filesData.forEach((fileData) => {
            const file = new File([fileData.data.toString("hex")], fileData.name, {
                type: fileData.mimeType,
            });
            dt.items.add(file);
        });

        return dt;
    }, filesData);

    // Now dispatch
    await page.dispatchEvent("[data-testid='dropZone']", "drop", { dataTransfer });

    const appleWatchDiv = page.locator(`[data-testid='Yearless Fitbit Export']`);

    await appleWatchDiv.filter({ hasText: "Apple Export" }).first().isVisible();
    await appleWatchDiv.filter({ hasText: "2 files" }).first().isVisible();
    await appleWatchDiv.filter({ hasText: "Upload" }).first().isVisible();

    await page.getByTestId("Apple Export-btn").click();
    // Should be gone after upload
    await expect(page.getByText("Apple Export")).not.toBeVisible();
    await expect(page.getByText("2 files")).not.toBeVisible();
    await expect(page.getByTestId("Apple Export-btn")).not.toBeVisible();

    // Fitbit data should not be accepted
    await expect(page.getByText("2018")).not.toBeVisible();

    // Upload again
    await page.dispatchEvent("[data-testid='dropZone']", "drop", { dataTransfer });
    await expect(page.getByText("Apple Export")).toBeVisible();

    // Should delete Files after switching button
    // selecting Fitbit data
    await page.getByLabel("Fitbit").check();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    await expect(page.getByText("Apple Export")).not.toBeVisible();
});
