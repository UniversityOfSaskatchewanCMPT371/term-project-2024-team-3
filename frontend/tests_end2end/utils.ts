/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { Page } from "playwright";

const setupLogin = async (page: Page): Promise<void> => {
    await page.waitForTimeout(500);
    await page.goto("./login");

    await page.fill("#username", "hello");
    await page.fill("#password", "123");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
};

export { setupLogin };
