import React from "react";
import userEvent from "@testing-library/user-event";
import { renderWithProvider } from "shared/util/tests/render";
import * as useAuth from "components/Authentication/useAuth";
import ProgressBar from "./ProgressBar";

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
    const { getByText, getByTestId } = renderWithProvider(<ProgressBar percentage={70} />);

    getByTestId("popup");
    getByText("70%");
    getByText("Your request is being processed. Please wait...");
    const button = getByTestId("minimizeButton");
    if (button === null) {
        throw new Error("Button didnt render");
    } else {
        // press the button
        userEvent.click(button);
    }
});
