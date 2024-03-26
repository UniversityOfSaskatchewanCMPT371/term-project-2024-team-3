/// <reference lib="dom"/>
/* eslint-disable @typescript-eslint/no-shadow */
import { test, expect } from "@playwright/test";
import { setupLogin } from "./utils";
import { appleWatchData, fitbitData } from "./testDataBuffers";

test("T2.8 File Upload Page Test", async ({ page }) => {
    await setupLogin(page);

    // go to File Upload Page
    await page.goto("./FileUploadPage");

    // Check if the page has all expected content
    await expect(page.getByRole("navigation")).toBeVisible();

    await expect(page.getByText("Select File Type: FitbitApple")).toBeVisible();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    await expect(page.getByText("Drop items here or Browse Files")).toBeVisible();

    // selecting Apple Watch data
    await page.getByLabel("Apple Watch").check();
    await expect(page.getByLabel("Fitbit")).not.toBeChecked();
    await expect(page.getByLabel("Apple Watch")).toBeChecked();

    // selecting Fitbit data
    await page.getByLabel("Fitbit").check();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    await expect(page.locator(".dzu-dropzone")).toBeVisible();
});

test("T4.8 Test Uploading Fitbit Files", async ({ page }) => {
    await setupLogin(page);

    // go to File Upload Page
    await page.goto("./FileUploadPage");

    // Should be default fitbit selector
    await page.getByLabel("Fitbit").check();
    await expect(page.getByLabel("Fitbit")).toBeChecked();
    await expect(page.getByLabel("Apple Watch")).not.toBeChecked();

    await expect(page.getByText("Drop items here or Browse Files")).toBeVisible();

    // Does not matter what is inside the file!
    const buffer = fitbitData;

    const filesData = [
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
    await page.dispatchEvent("[class='dzu-dropzone']", "drop", { dataTransfer });

    await expect(page.getByText("lightly_active_minutes-2018-02-15.json, 15bytes")).toBeVisible();
    await expect(page.getByText("lightly_active_minutes-2018-05-15.json, 15bytes")).toBeVisible();

    // Apple watch data should not be accepted
    await expect(page.getByText("1_export.xml, 15bytes")).not.toBeVisible();

    // Upload Files
    await expect(page.locator(".dzu-submitButton")).toBeVisible();
    await page.waitForTimeout(5000);
    await page.locator(".dzu-submitButton").click();

    // Should be gone after upload
    await expect(page.getByText("wat.json, 15bytes")).not.toBeVisible();
    await expect(
        page.getByText("lightly_active_minutes-2018-02-15.json, 15bytes"),
    ).not.toBeVisible();
    await expect(
        page.getByText("lightly_active_minutes-2018-05-15.json, 15bytes"),
    ).not.toBeVisible();
});

test("T4.9 Test Uploading Applewatch Files", async ({ page }) => {
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
            mimeType: "text/xml",
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
    await page.dispatchEvent("[class='dzu-dropzone']", "drop", { dataTransfer });

    await expect(page.getByText("1_export.xml, 15bytes")).toBeVisible();

    // Fitbit data should not be accepted
    await expect(
        page.getByText("lightly_active_minutes-2018-02-15.json, 15bytes"),
    ).not.toBeVisible();

    // Upload Files
    await expect(page.locator(".dzu-submitButton")).toBeVisible();
    await page.waitForTimeout(5000);
    await page.locator(".dzu-submitButton").click();

    await expect(page.getByText("1_export.xml, 15bytes")).not.toBeVisible();
});
