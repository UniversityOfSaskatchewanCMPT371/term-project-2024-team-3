import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
// import { getByLabelText, getByTestId, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProcessedDataPage from "./ProcessedDataPage";

test("TID 3.16 Render ProcessDataPage Components", () => {
  const { getByText, getByTestId, getByLabelText } = renderWithProvider(
    <ProcessedDataPage />,
  );

  // radials rendering and verifying that 1 can be checked at a time
  const SVMRad = getByLabelText("SVM");
  const RandomRad = getByLabelText("Random Forest");
  const DecissionRad = getByLabelText("Decission Tree");
  getByText("SVM");

  userEvent.click(SVMRad);
  expect(SVMRad).toBeChecked();
  expect(RandomRad).not.toBeChecked();
  expect(DecissionRad).not.toBeChecked();

  userEvent.click(RandomRad);
  expect(SVMRad).not.toBeChecked();
  expect(RandomRad).toBeChecked();
  expect(DecissionRad).not.toBeChecked();

  userEvent.click(DecissionRad);
  expect(SVMRad).not.toBeChecked();
  expect(RandomRad).not.toBeChecked();
  expect(DecissionRad).toBeChecked();

  // buttons rendering
  const predictButton = getByTestId("Predict_Button");
  const downloadButton = getByTestId("Download_Button");
  const deleteButton = getByTestId("Delete_Button");

  userEvent.click(predictButton);
  userEvent.click(downloadButton);
  userEvent.click(deleteButton);

  // NEXT TEST FUNCTIONALITY
});
