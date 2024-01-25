import React from "react";
import { render } from "@testing-library/react";
import ProcessedDataPage from "./processedDataPage";

// jest.mock(
//   "./processDataPage",
//   () =>
//     function () {
//       return <span>ProcessedDataPage</span>;
//     },
// );

test("Renders ProcessDataPage", () => {
  const { getByText, getByRole } = render(<ProcessedDataPage />);
  getByText("Step 2 - Data prediction and download:");
  getByText("In this step you can either download the");
  getByText(".csv");
  getByText(
    "of your Apple Watch or Fitbit data or, use our machine learning methods to predict lying, sitting, and walking at difference intensities. Select the file you want to predict, select the machine learning model for the prediction (we recommend Random Forrest) and click the",
  );
  getByText("Predicted Files");
  getByText(
    "button. Once prediction is complete, move to the predicted files page.",
  );
  getByText("SVM");
  getByText("Random Forest");
  getByText("Download File");
  getByText("Decission Tree");
  getByText("Go To Predicted Files");
});