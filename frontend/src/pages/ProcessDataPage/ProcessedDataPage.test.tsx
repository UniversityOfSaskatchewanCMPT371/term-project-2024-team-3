import React from "react";
import { getByTestId, render } from "@testing-library/react";
import ProcessedDataPage from "./ProcessedDataPage";

test("TID 3.16 Render ProcessDataPage Components", () => {
  const { getByText, getByTestId } = render(<ProcessedDataPage />);

  // radials rendering
  getByTestId("SVM_Radial");
  getByTestId("RandomForest_Radial");
  getByTestId("DecissionTree_Radial");

  // buttons rendering
  getByTestId("Predict_Button");
  getByTestId("Download_Button");
  getByTestId("Delete_Button");
});
