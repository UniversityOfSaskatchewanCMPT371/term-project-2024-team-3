import { test, expect } from "@playwright/test";

test("Home Page Test", async ({ page }) => {
  // go to home page
  await page.goto("./");

  // Check if the page has all expected content

  const BeapLogo = page.getByRole("img", { name: "Beap Logo" });

  await expect(BeapLogo).toBeVisible();

  const MainTitle = page.locator("#root");

  await expect(MainTitle).toContainText("BEAP ENGINE");

  const subTitle = page.locator("h6");

  await expect(subTitle).toContainText("Accurately Process Your Fitness Data");

  const LoginButton = page.getByText("Login", { exact: true });

  await expect(LoginButton).toBeVisible();

  const SignUpButton = page.getByRole("link", { name: "Sign Up" });

  await expect(SignUpButton).toBeVisible();

  const TitleContribution = page.locator("#desc");

  await expect(TitleContribution).toContainText("How To Contribute Data");

  const AppleLink = page.getByRole("link", { name: "Apple Watch Extraction" });

  await expect(AppleLink).toBeVisible();

  const FitbitLink = page.getByRole("link", {
    name: "Fitbit Extraction Protocol",
  });

  await expect(FitbitLink).toBeVisible();

  const ProjectDescription = page.locator("#desc");

  await expect(ProjectDescription).toContainText(
    "BEAP Engine is a research project developed by Dr. Daniel Fuller and the Built Environment and Active Populations (BEAP) Lab. The purpose of this study is to collect and analyze large volumes of Apple Watch and Fitbit data and develop methods to standardize across device. We provide you with a CSV file of your data and give you detailed information about sedentary behaviour, and moderate to vigorous activity based on our machine learning methods. We hope you will participate in our study.",
  );

  const BeapOverview = page.getByRole("img", { name: "Beap engine overview" });

  await expect(BeapOverview).toBeVisible();

  const LoginArrow = page.getByText("Login arrow_right_alt");

  await expect(LoginArrow).toBeVisible();

  const SignUpArrow = page.getByRole("link", { name: "SignUp" });

  await expect(SignUpArrow).toBeVisible();

  const Proposal = page.locator("h4");

  await expect(Proposal).toContainText(
    "The proposal for this research has been reviewed by the Interdisciplinary Committee on Ethics in Human Research and found to be in compliance with Memorial University’s ethics policy. If you have ethical concerns about the research, such as the way you have been treated or your rights as a participant, you may contact the Chairperson of the ICEHR at icehr@mun.caor by telephone at 709-864-2861",
  );

  const Copyright = page.locator("#root");

  await expect(Copyright).toContainText("copyright2020 BEAP Lab");
});
