/* eslint-disable import/no-extraneous-dependencies */
import { Page } from "playwright";

async function setupMockLogin(page: Page): Promise<void> {
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
}

export default setupMockLogin;
