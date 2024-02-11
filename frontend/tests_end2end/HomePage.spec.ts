import { test, expect } from "@playwright/test";

test("Home Page Test", async ({ page }) => {
  // go to home page
  await page.goto("./");

  // Check if the page has all expected content

  await expect(page.getByRole("img", { name: "Beap Logo" })).toBeVisible();

  await expect(page.locator("#root")).toContainText("BEAP ENGINE");

  await expect(page.locator("h6")).toContainText(
    "Accurately Process Your Fitness Data",
  );

  await expect(page.getByText("Login", { exact: true })).toBeVisible();

  await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();

  await expect(page.locator("#desc")).toContainText("How To Contribute Data");

  await expect(
    page.getByRole("link", { name: "Apple Watch Extraction" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: "Fitbit Extraction Protocol",
    }),
  ).toBeVisible();

  await expect(page.locator("#desc")).toContainText(
    "BEAP Engine is a research project developed by Dr. Daniel Fuller and the Built Environment and Active Populations (BEAP) Lab. The purpose of this study is to collect and analyze large volumes of Apple Watch and Fitbit data and develop methods to standardize across device. We provide you with a CSV file of your data and give you detailed information about sedentary behaviour, and moderate to vigorous activity based on our machine learning methods. We hope you will participate in our study.",
  );

  await expect(
    page.getByRole("img", { name: "Beap engine overview" }),
  ).toBeVisible();

  await expect(page.getByText("Login arrow_right_alt")).toBeVisible();

  await expect(page.getByRole("link", { name: "SignUp" })).toBeVisible();

  await expect(page.locator("h4")).toContainText(
    "The proposal for this research has been reviewed by the Interdisciplinary Committee on Ethics in Human Research and found to be in compliance with Memorial University’s ethics policy. If you have ethical concerns about the research, such as the way you have been treated or your rights as a participant, you may contact the Chairperson of the ICEHR at icehr@mun.caor by telephone at 709-864-2861",
  );

  await expect(page.locator("#root")).toContainText("copyright2020 BEAP Lab");
});
