import React from "react";
import { render } from "@testing-library/react";
import HomePage from "./HomePage";

test("renders learn react link", () => {
  const { getByText } = render(<HomePage />);
  getByText("BEAP ENGINE");
  getByText("Accurately Process Your Fitness Data");
  getByText("How To Contribute Data");
  getByText(
    "BEAP Engine is a research project developed by Dr. Daniel Fuller and the Built Environment and Active Populations (BEAP) Lab. The purpose of this study is to collect and analyze large volumes of Apple Watch and Fitbit data and develop methods to standardize across device. We provide you with a CSV file of your data and give you detailed information about sedentary behaviour, and moderate to vigorous activity based on our machine learning methods. We hope you will participate in our study.",
  );
});
