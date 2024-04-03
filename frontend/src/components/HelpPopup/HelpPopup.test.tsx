import React from "react";
import userEvent from "@testing-library/user-event";
import { renderWithProvider } from "shared/util/tests/render";
import * as useAuth from "components/Authentication/useAuth";
import HelpPopup from "./HelpPopup";

// Define the type for the mock return value of useAuth
type AuthReturnValue = {
    isAuthenticated: boolean;
};

const authSpy = jest.spyOn(useAuth, "useAuth");

afterEach(() => {
    authSpy.mockClear();
});

test("TID 3.1. Renders HelpPopup component", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    const { getByText, getByTestId } = renderWithProvider(<HelpPopup />);
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
            expect(getByTestId("Paragraph 0").getAttribute("values")).toEqual("opened");
            getByText(
                "Step 1: Drag and drop your files into the upload box. Once uploaded your files will appear in the Uploaded Files section on the right. You can select the file you want to process and click the process button. Once you have processed your data it will be saved. You do not need to process it again. Click Go To Processed Files to move to the processed data menu.",
            );

            // closing
            userEvent.click(button);
            expect(getByTestId("Paragraph 0").getAttribute("values")).toEqual("closed");
        }

        button = getByTestId("button 1");
        if (button === null) {
            throw new Error("Button didnt render");
        } else {
            // open
            userEvent.click(button);
            expect(getByTestId("Paragraph 1").getAttribute("values")).toEqual("opened");
            getByText(
                "Step 2 - Data prediction and download: In this step you can either download the.csvof your Apple Watch or Fitbit data or, use our machine learning methods to predict lying, sitting, and walking at difference intensities. Select the file you want to predict, select the machine learning model for the prediction (we recommend Random Forrest) and click the Predict File button. Once prediction is complete, move to the predicted files page.",
            );

            // closing
            userEvent.click(button);
            expect(getByTestId("Paragraph 1").getAttribute("values")).toEqual("closed");
        }

        button = getByTestId("button 2");
        if (button === null) {
            throw new Error("Button didnt render");
        } else {
            userEvent.click(button);
            expect(getByTestId("Paragraph 2").getAttribute("values")).toEqual("opened");

            getByText(
                "Step 3 - Predicted data files: On this page, you can download your new data files with both the raw Apple Watch or Fitbit data, the features we use for our machine learning models, and the predicted activity for each minute of your data. If you want to upload different files, go back to the file upload page. You can also click on individual steps to rerun a different machine learning model if you want.",
            );

            // closing
            userEvent.click(button);
            expect(getByTestId("Paragraph 2").getAttribute("values")).toEqual("closed");
        }

        // close the popup
        button = getByTestId("closePopupButton");
        userEvent.click(button);
    }
});
