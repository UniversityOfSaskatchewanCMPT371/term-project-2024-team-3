/* eslint-disable import/no-extraneous-dependencies */
import { Page } from "playwright";
import { WatchType } from "shared/api";

const setupMockLogin = async (page: Page): Promise<void> => {
    await page.goto("./login");

    await page.route("**/loginuser", async (route) => {
        const responseData = {
            userID: 123,
            Authorities: ["admin"],
        };
        await route.fulfill({
            status: 200,
            headers: {
                "Content-Type": "application/json",
                token: "mockToken",
            },
            body: JSON.stringify(responseData),
        });
    });

    await page.fill("#username", "testuser");
    await page.fill("#password", "testpassword");
    await page.click('button[type="submit"]');
};

const setupMockUpload = async (page: Page, type: WatchType): Promise<void> => {
    await page.route(`**/rest/beapengine/${type}/upload`, async (route) => {
        await route.fulfill({
            status: 200,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    });
};

export { setupMockLogin, setupMockUpload };
