/* eslint-disable import/no-extraneous-dependencies */
import { Page } from "playwright";
import { WatchType } from "shared/api";

const setupLogin = async (page: Page): Promise<void> => {
    await page.waitForTimeout(5000);
    await page.goto("./login");

    await page.fill("#username", "hello");
    await page.fill("#password", "123");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
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

export { setupLogin, setupMockUpload };
