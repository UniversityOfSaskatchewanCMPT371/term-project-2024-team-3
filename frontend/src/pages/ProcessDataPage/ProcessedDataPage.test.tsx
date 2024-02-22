import React from "react";
import { render } from "@testing-library/react";
import ProcessedDataPage from "./ProcessedDataPage";

test("TID 1.3. Render ProcessDataPage Components", () => {
  const { getByText } = render(<ProcessedDataPage />);
  // getByText("Step 2 - Data prediction and download:");
  // getByText("In this step you can either download the");
  // getByText(".csv");
  // getByText(
  //   "of your Apple Watch or Fitbit data or, use our machine learning methods to predict lying, sitting, and walking at difference intensities. Select the file you want to predict, select the machine learning model for the prediction (we recommend Random Forrest) and click the",
  // );
  getByText("SVM");
  getByText("Random Forest");
  getByText("Download File");
  getByText("Decission Tree");
  getByText("Predict File");
  getByText("DELETE FILE");
});
