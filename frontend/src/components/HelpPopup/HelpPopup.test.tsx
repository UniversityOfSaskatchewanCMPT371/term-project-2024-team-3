import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HelpPopup from "./HelpPopup";

test("TID 3.1. Renders HelpPopup component", () => {
  const { getByText, getByTestId } = render(<HelpPopup />);

  // dom.getByText("? Help");

  // clicking the popup expand button
  getByTestId("popupButton");
  let button = getByTestId("popupButton");
  if (button === null) {
    throw new Error("Button didnt render");
  } else {
    // opening popup
    userEvent.click(button);
    getByTestId("popup");
    // checking titles
    getByText("File Upload");
    getByText("Processed Files");
    getByText("Predicted Files");

    // checking for buttons
    getByTestId("button 0");
    getByTestId("button 1");
    getByTestId("button 2");
    getByTestId("closePopupButton");

    // clicking each button
    button = getByTestId("button 0");
    if (button === null) {
      throw new Error("Button didnt render");
    } else {
      userEvent.click(button);
      expect(getByTestId("Paragraph 0").getAttribute("values")).toEqual(
        "opened",
      );
      expect(getByTestId("button 0").innerHTML).toEqual("^");
      getByText(
        "Step 1: Drag and drop your files into the upload box. Once uploaded your files will appear in the Uploaded Files section on the right. You can select the file you want to process and click the process button. Once you have processed your data it will be saved. You do not need to process it again. Click Go To Processed Files to move to the processed data menu.",
      );

      // // closing
      userEvent.click(button);
      expect(getByTestId("Paragraph 0").getAttribute("values")).toEqual(
        "closed",
      );

      expect(getByTestId("button 0").innerHTML).toEqual("v");
    }

    button = getByTestId("button 1");
    if (button === null) {
      throw new Error("Button didnt render");
    } else {
      // open
      userEvent.click(button);
      expect(getByTestId("Paragraph 1").getAttribute("values")).toEqual(
        "opened",
      );
      expect(getByTestId("button 1").innerHTML).toEqual("^");
      getByText(
        "Step 2 - Data prediction and download: In this step you can either download the.csvof your Apple Watch or Fitbit data or, use our machine learning methods to predict lying, sitting, and walking at difference intensities. Select the file you want to predict, select the machine learning model for the prediction (we recommend Random Forrest) and click the Predict File button. Once prediction is complete, move to the predicted files page.",
      );

      // closing
      userEvent.click(button);
      expect(getByTestId("Paragraph 1").getAttribute("values")).toEqual(
        "closed",
      );
      expect(getByTestId("button 1").innerHTML).toEqual("v");
    }

    button = getByTestId("button 2");
    if (button === null) {
      throw new Error("Button didnt render");
    } else {
      userEvent.click(button);
      expect(getByTestId("Paragraph 2").getAttribute("values")).toEqual(
        "opened",
      );
      expect(getByTestId("button 2").innerHTML).toEqual("^");

      getByText(
        "Step 3 - Predicted data files: On this page, you can download your new data files with both the raw Apple Watch or Fitbit data, the features we use for our machine learning models, and the predicted activity for each minute of your data. If you want to upload different files, go back to the file upload page. You can also click on individual steps to rerun a different machine learning model if you want.",
      );

      // closing
      userEvent.click(button);
      expect(getByTestId("Paragraph 2").getAttribute("values")).toEqual(
        "closed",
      );
      expect(getByTestId("button 2").innerHTML).toEqual("v");
    }

    // close the popup
    button = getByTestId("closePopupButton");
    userEvent.click(button);
  }
});
