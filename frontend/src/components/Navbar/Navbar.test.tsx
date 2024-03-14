import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as useAuth from "components/Authentication/useAuth";
import Navbar from "./Navbar";

// Define the type for the mock return value of useAuth
type AuthReturnValue = {
    isAuthenticated: boolean;
};

const authSpy = jest.spyOn(useAuth, "useAuth");

afterEach(() => {
    authSpy.mockClear();
});

test("renders all links when user is authenticated", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    render(
        <Router>
            <Navbar />
        </Router>,
    );

    const homeLink = screen.getByText(/HOME/i);
    expect(homeLink).toBeInTheDocument();

    const fileUploadLink = screen.getByText(/FILE UPLOAD/i);
    expect(fileUploadLink).toBeInTheDocument();

    const processedFilesLink = screen.getByText(/PROCESSED FILES/i);
    expect(processedFilesLink).toBeInTheDocument();

    const predictedFilesLink = screen.getByText(/PREDICTED FILES/i);
    expect(predictedFilesLink).toBeInTheDocument();

    // const logohomelink = screen.getByText(/LOGOUT/i);
    // expect(logoutLink).toBeInTheDocument();

    const beapLogoImage = screen.getByAltText(/beapLogo/i);
    expect(beapLogoImage).toBeInTheDocument();

    const profileLogoImage = screen.getByAltText(/profileLogo/i);
    expect(profileLogoImage).toBeInTheDocument();
});

test("does not render when user is not authenticated", () => {
    authSpy.mockReturnValue({ isAuthenticated: false } as AuthReturnValue);
    const { container } = render(
        <Router>
            <Navbar />
        </Router>,
    );

    expect(container.firstChild).toBeNull();
});
