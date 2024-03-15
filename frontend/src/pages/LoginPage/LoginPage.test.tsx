import React from "react";
import { fireEvent } from "@testing-library/react";
import * as useLogin from "shared/hooks/useLogin";
import { BrowserRouter as Router } from "react-router-dom";
import { renderWithProvider } from "shared/util/tests/render";
import LoginPage from "./LoginPage";

const mockHandleLogin = jest.fn();
const loginMock = {
    handleLogin: mockHandleLogin,
    isLoading: false,
    error: null,
};

describe("LoginPage component", () => {
    // Test rendering and initial state
    test("renders login form with initial state", () => {
        const { getAllByText, getByLabelText, getByText, getByPlaceholderText } =
            renderWithProvider(
                <Router>
                    <LoginPage />
                </Router>,
            );

        // Ensure necessary elements are present
        expect(getByLabelText("Username")).toBeInTheDocument();
        expect(getByLabelText("Password")).toBeInTheDocument();
        expect(getAllByText("Sign In")).toHaveLength(2);
        expect(getByText("Log into your existing BEAPENGINE account")).toBeInTheDocument();
        expect(getByText("Login with Google")).toBeInTheDocument();
        expect(getByText("OR")).toBeInTheDocument();
        expect(getByText("Researcher")).toBeInTheDocument();
        expect(getByText("Personal User")).toBeInTheDocument();
        expect(getByText("BEAP")).toBeInTheDocument();
        expect(getByText("ENGINE")).toBeInTheDocument();
        expect(getByText("JOIN OUR RESEARCH PROJECT")).toBeInTheDocument();
        expect(getByText("Get started for free")).toBeInTheDocument();

        // Ensure form inputs are initially empty
        expect(getByPlaceholderText("Enter your username")).toHaveValue("");
        expect(getByPlaceholderText("Enter your password")).toHaveValue("");
    });

    // Test user interactions and state changes
    test("allows user to type in username and password fields", () => {
        const { getByPlaceholderText } = renderWithProvider(
            <Router>
                <LoginPage />
            </Router>,
        );
        const usernameInput = getByPlaceholderText("Enter your username");
        const passwordInput = getByPlaceholderText("Enter your password");

        // Simulate user input in username and password fields
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        // Ensure the input values are updated
        expect(usernameInput).toHaveValue("testuser");
        expect(passwordInput).toHaveValue("testpassword");
    });

    // Test form submission
    test("test that button submits form with username and password on click", () => {
        // Mock handleLogin function
        const loginSpy = jest.spyOn(useLogin, "default");

        loginSpy.mockReturnValue(loginMock);

        const { getByTestId, getByPlaceholderText } = renderWithProvider(
            <Router>
                <LoginPage />
            </Router>,
        );
        const usernameInput = getByPlaceholderText("Enter your username");
        const passwordInput = getByPlaceholderText("Enter your password");

        // Simulate user input in username and password fields
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        // Ensure the input values are updated
        expect(usernameInput).toHaveValue("testuser");
        expect(passwordInput).toHaveValue("testpassword");

        // Simulate form submission by clicking the submit button
        const submitButton = getByTestId("submitButton");
        fireEvent.click(submitButton);

        // Ensure that the handleLogin function is called with the correct arguments
        expect(mockHandleLogin).toHaveBeenCalledWith("testuser", "testpassword");
    });

    // // check if the navigation button works as intended
    // it("should navigate to signup page when button is clicked", () => {

    //     const { getByTestId } = render(
    //         <Router>
    //             <LoginPage />
    //         </Router>,
    //     );

    //     const signUpNavigateButton = getByTestId("signupNavigate");
    //     fireEvent.click(signUpNavigateButton);
    //     // some form of expect here to make sure i went to the right page
    //     expect(window.location.pathname).toBe('/signup');
    // });

    // Test rotator belt for text display
    it("test that the rotator buttons change the text on the screen", () => {
        const loginSpy = jest.spyOn(useLogin, "default");

        loginSpy.mockReturnValue(loginMock);

        const { getByTestId } = renderWithProvider(
            <Router>
                <LoginPage />
            </Router>,
        );

        // select the forward and backward button
        const previousButton = getByTestId("previousButton");
        const forwardButton = getByTestId("forwardButton");

        // select the text display and its text content
        // const textDisplayZone= getByTestId("textZone");
        const initialTextContent = getByTestId("textZone").textContent;

        // click forward button and confirm the text content changed.
        fireEvent.click(forwardButton);
        const updatedTextContent = getByTestId("textZone").textContent;
        expect(updatedTextContent).not.toEqual(initialTextContent);

        // click backWard button and confirm text content returns to original value
        fireEvent.click(previousButton);
        const updatedTextContentAgain = getByTestId("textZone").textContent;
        expect(updatedTextContentAgain).toEqual(initialTextContent);

        // click forward twice then back once and confirm the text content is the same as a one click.
        fireEvent.click(forwardButton);
        fireEvent.click(forwardButton);
        fireEvent.click(previousButton);
        const updatedTextContent3 = getByTestId("textZone").textContent;
        expect(updatedTextContent3).toEqual(updatedTextContent);
    });
});
