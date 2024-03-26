import React from "react";
import userEvent from "@testing-library/user-event";
import { renderWithProvider } from "shared/util/tests/render";
import * as useAuth from "components/Authentication/useAuth";
import { ProgressBar } from "./ProgressBar";

// Define the type for the mock return value of useAuth
type AuthReturnValue = {
    isAuthenticated: boolean;
};

const authSpy = jest.spyOn(useAuth, "useAuth");

afterEach(() => {
    authSpy.mockClear();
});

test("TID 5.01. Renders ProgressBar component", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    const { getByText, getByTestId } = renderWithProvider(
        <ProgressBar percentage={70} message="This is a test message" isVisible />,
    );

    const popup = getByTestId("progressBarPopup"); // popup displays
    getByText("70%"); // correct percent in the bar
    getByText("This is a test message");

    const progressBar = getByTestId("progressBarInner");

    expect(progressBar.style.width).toEqual("70%"); // making sure the width is correct

    const minButton = getByTestId("minimizeButton");
    if (minButton === null) {
        throw new Error("minButton did not render");
    } else {
        // press the minimize button
        userEvent.click(minButton);
        expect(popup).not.toBeVisible(); // should be hidden
        const maxButton = getByTestId("maximizeButton");
        if (maxButton === null) {
            throw new Error("maxButton did not render");
        } else {
            // click the max button
            expect(maxButton).toBeInTheDocument();
            userEvent.click(maxButton);

            expect(popup).toBeVisible(); // should be visible
            getByText("70%"); // correct percent in the bar
            getByText("This is a test message");
        }
    }
});

test("TID 5.02. Does not render ProgressBar component with isVisible=false", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    const { container } = renderWithProvider(
        <ProgressBar percentage={70} message="This is a test message" isVisible={false} />,
    );

    expect(container).toBeEmptyDOMElement();
});

test("TID 5.03. Does not render ProgressBar component with percentage < 0", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    const { container } = renderWithProvider(
        <ProgressBar percentage={-1} message="This is a test message" isVisible />,
    );

    expect(container).toBeEmptyDOMElement();
});

test("TID 5.04. Does not render ProgressBar component with percentage > 100", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    const { container } = renderWithProvider(
        <ProgressBar percentage={101} message="This is a test message" isVisible />,
    );

    expect(container).toBeEmptyDOMElement();
});

test("TID 5.05. Renders ProgressBar component", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    const { getByText, getByTestId } = renderWithProvider(
        <ProgressBar percentage={5} message="This is a test message" isVisible />,
    );

    const popup = getByTestId("progressBarPopup"); // popup displays
    getByText("5%"); // correct percent in the bar.
    getByText("This is a test message");

    const progressBar = getByTestId("progressBarInner");

    expect(progressBar.style.width).toEqual("9%"); // making sure the width is correct. 9 is the minumum

    const minButton = getByTestId("minimizeButton");
    if (minButton === null) {
        throw new Error("minButton did not render");
    } else {
        // press the minimize button
        userEvent.click(minButton);
        expect(popup).not.toBeVisible(); // should be hidden
        const maxButton = getByTestId("maximizeButton");
        if (maxButton === null) {
            throw new Error("maxButton did not render");
        } else {
            // click the max button
            expect(maxButton).toBeInTheDocument();
            userEvent.click(maxButton);

            expect(popup).toBeVisible(); // should be visible
            getByText("5%"); // correct percent in the bar
            getByText("This is a test message");
        }
    }
});
