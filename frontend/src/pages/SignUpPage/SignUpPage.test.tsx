import React from "react";
import { fireEvent } from "@testing-library/react";
import * as useSignUp from "shared/hooks/useSignup";
import { BrowserRouter as Router } from "react-router-dom";
import { renderWithProvider } from "shared/util/tests/render";
import SignUpPage from "./SignUpPage";

const mockHandleSignup = jest.fn();
const signupMock = {
    handleSignup: mockHandleSignup,
    isLoading: false,
    error: null,
};

describe("SignUpPage component", () => {
    // Test rendering and initial state
    test("renders login form with initial state", () => {
        const { getAllByText, getByTestId, getByLabelText, getByText, getByPlaceholderText } =
            renderWithProvider(
                <Router>
                    <SignUpPage />
                </Router>,
            );

        // Ensure necessary elements are present
        expect(getByTestId("researcherButton")).toBeInTheDocument();
        expect(getByTestId("personalUserButton")).toBeInTheDocument();
        expect(getByTestId("firstName")).toBeInTheDocument();
        expect(getByTestId("lastName")).toBeInTheDocument();
        expect(getByTestId("userName")).toBeInTheDocument();
        expect(getByTestId("password")).toBeInTheDocument();
        expect(getByLabelText("Confirm")).toBeInTheDocument();
        expect(getByTestId("policyAgreementLink")).toBeInTheDocument();
        expect(getByTestId("policyAgreementCheck")).toBeInTheDocument();
        expect(getAllByText("Sign Up")).toHaveLength(2);
        expect(getByText("Log into your BEAPENGINE account")).toBeInTheDocument();
        expect(getByText("OR")).toBeInTheDocument();
        expect(getByTestId("navigateSignIn")).toBeInTheDocument();
        expect(getByText("BEAP")).toBeInTheDocument();
        expect(getByText("ENGINE")).toBeInTheDocument();
        expect(getByText("JOIN OUR RESEARCH PROJECT")).toBeInTheDocument();

        // Ensure form inputs are initially empty
        expect(getByPlaceholderText("Enter your username")).toHaveValue("");
        expect(getByPlaceholderText("Enter your password")).toHaveValue("");
        expect(getByPlaceholderText("Enter your first name")).toHaveValue("");
        expect(getByPlaceholderText("Enter your last name")).toHaveValue("");
    });

    // Test user interactions and state changes
    test("allows user to type in first name, last name, username and password fields", () => {
        const { getByPlaceholderText } = renderWithProvider(
            <Router>
                <SignUpPage />
            </Router>,
        );
        const usernameInput = getByPlaceholderText("Enter your username");
        const passwordInput = getByPlaceholderText("Enter your password");
        const firstNameInput = getByPlaceholderText("Enter your first name");
        const lastNameInput = getByPlaceholderText("Enter your last name");

        // Simulate user input in username and password fields
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        fireEvent.change(firstNameInput, { target: { value: "testfirstname" } });
        fireEvent.change(lastNameInput, { target: { value: "testlastname" } });

        // Ensure the input values are updated
        expect(usernameInput).toHaveValue("testuser");
        expect(passwordInput).toHaveValue("testpassword");
        expect(firstNameInput).toHaveValue("testfirstname");
        expect(lastNameInput).toHaveValue("testlastname");
    });

    // Test form submission with passing conditions
    test("test that button submits form with first name, last name, username and password on click", () => {
        // Mock handleSignup function
        const signupSpy = jest.spyOn(useSignUp, "default");
        signupSpy.mockReturnValue(signupMock);

        const { getByTestId, getByPlaceholderText } = renderWithProvider(
            <Router>
                <SignUpPage />
            </Router>,
        );
        const usernameInput = getByPlaceholderText("Enter your username");
        const passwordInput = getByPlaceholderText("Enter your password");
        const passwordConfirmationInput = getByPlaceholderText("Confirm your password");
        const firstNameInput = getByPlaceholderText("Enter your first name");
        const lastNameInput = getByPlaceholderText("Enter your last name");
        const policyAgreementCheckButton = getByTestId("policyAgreementCheck");

        // Simulate user input in username and password fields
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        fireEvent.change(passwordConfirmationInput, { target: { value: "testpassword" } });
        fireEvent.change(firstNameInput, { target: { value: "testfirstname" } });
        fireEvent.change(lastNameInput, { target: { value: "testlastname" } });
        fireEvent.click(policyAgreementCheckButton);

        // Ensure the input values are updated
        expect(usernameInput).toHaveValue("testuser");
        expect(passwordInput).toHaveValue("testpassword");
        expect(passwordConfirmationInput).toHaveValue("testpassword");
        expect(firstNameInput).toHaveValue("testfirstname");
        expect(lastNameInput).toHaveValue("testlastname");

        // Simulate form submission by clicking the submit button
        const submitButton = getByTestId("submitButton");
        fireEvent.click(submitButton);

        // Ensure that the handleLogin function is called with the correct arguments
        expect(mockHandleSignup).toHaveBeenCalledWith(
            "testfirstname",
            "testlastname",
            "testuser",
            "testpassword",
        );
    });

    // Test form submission with privacy policy unaccepted
    test("test that form is not submitted if privacy policy is not agreed to", () => {
        // Mock handleSignup function
        const signupSpy = jest.spyOn(useSignUp, "default");
        signupSpy.mockReturnValue(signupMock);

        const { getByText, getByTestId, getByPlaceholderText } = renderWithProvider(
            <Router>
                <SignUpPage />
            </Router>,
        );
        const usernameInput = getByPlaceholderText("Enter your username");
        const passwordInput = getByPlaceholderText("Enter your password");
        const passwordConfirmationInput = getByPlaceholderText("Confirm your password");
        const firstNameInput = getByPlaceholderText("Enter your first name");
        const lastNameInput = getByPlaceholderText("Enter your last name");

        // Simulate user input in username and password fields
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        fireEvent.change(passwordConfirmationInput, { target: { value: "testpassword" } });
        fireEvent.change(firstNameInput, { target: { value: "testfirstname" } });
        fireEvent.change(lastNameInput, { target: { value: "testlastname" } });

        // Simulate form submission by clicking the submit button
        const submitButton = getByTestId("submitButton");
        fireEvent.click(submitButton);

        // Ensure that the unchecked privacy policy error appears
        expect(getByText("Please accept the privacy policy.")).toBeInTheDocument();
    });

    // Test form submission with unmatching password confirmation
    test("test that form info is not submitted if passwords don't match", () => {
        // Mock handleSignup function
        const signupSpy = jest.spyOn(useSignUp, "default");
        signupSpy.mockReturnValue(signupMock);

        const { getByText, getByTestId, getByPlaceholderText } = renderWithProvider(
            <Router>
                <SignUpPage />
            </Router>,
        );
        const usernameInput = getByPlaceholderText("Enter your username");
        const passwordInput = getByPlaceholderText("Enter your password");
        const passwordConfirmationInput = getByPlaceholderText("Confirm your password");
        const firstNameInput = getByPlaceholderText("Enter your first name");
        const lastNameInput = getByPlaceholderText("Enter your last name");
        const policyAgreementCheckButton = getByTestId("policyAgreementCheck");

        // Simulate user input in username and password fields
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        fireEvent.change(passwordConfirmationInput, { target: { value: "unmatchingpassword" } });
        fireEvent.change(firstNameInput, { target: { value: "testfirstname" } });
        fireEvent.change(lastNameInput, { target: { value: "testlastname" } });
        fireEvent.click(policyAgreementCheckButton);

        // Simulate form submission by clicking the submit button
        const submitButton = getByTestId("submitButton");
        fireEvent.click(submitButton);

        // Ensure that the unmatching password error div appears
        expect(getByText("Passwords do not match")).toBeInTheDocument();
    });

    // Test form submission with unfilled fields
    test("test that form does not work if an element is missing", () => {
        // Mock handleSignup function
        const signupSpy = jest.spyOn(useSignUp, "default");
        signupSpy.mockReturnValue(signupMock);

        const { getByTestId, getByPlaceholderText } = renderWithProvider(
            <Router>
                <SignUpPage />
            </Router>,
        );
        const usernameInput = getByPlaceholderText("Enter your username");
        const passwordInput = getByPlaceholderText("Enter your password");
        const firstNameInput = getByPlaceholderText("Enter your first name");
        const lastNameInput = getByPlaceholderText("Enter your last name");
        const policyAgreementCheckButton = getByTestId("policyAgreementCheck");

        // Simulate user input in username and password fields
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        fireEvent.change(firstNameInput, { target: { value: "testfirstname" } });
        fireEvent.change(lastNameInput, { target: { value: "testlastname" } });
        fireEvent.click(policyAgreementCheckButton);

        // Simulate form submission by clicking the submit button
        const submitButton = getByTestId("submitButton");
        fireEvent.click(submitButton);

        // Ensure that the handleLogin function is called with the correct arguments
        expect(mockHandleSignup).not.toHaveBeenCalledWith(
            "testfirstname",
            "testlastname",
            "testuser",
            "testpassword",
        );
    });

    // Test rotator belt for text display
    it("test that the rotator buttons change the text on the screen", () => {
        const signupSpy = jest.spyOn(useSignUp, "default");
        signupSpy.mockReturnValue(signupMock);

        const { getByTestId } = renderWithProvider(
            <Router>
                <SignUpPage />
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

// Please fill out this field.
