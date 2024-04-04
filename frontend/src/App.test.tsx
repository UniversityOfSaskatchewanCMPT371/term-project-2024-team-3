import React from "react";
import { screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { renderWithProvider } from "shared/util/tests/render";
import * as useAuth from "components/Authentication/useAuth";
import Navbar from "./components/Navbar/Navbar";

// Define the type for the mock return value of useAuth
type AuthReturnValue = {
    isAuthenticated: boolean;
};

const authSpy = jest.spyOn(useAuth, "useAuth");

afterEach(() => {
    authSpy.mockClear();
});

test("TID 1.4. renders all links", () => {
    authSpy.mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
    renderWithProvider(
        <Router>
            <Navbar />
        </Router>,
    );

    const fileUploadLink = screen.getByText(/FILE UPLOAD/i);
    expect(fileUploadLink).toBeInTheDocument();

    const processedFilesLink = screen.getByText(/PROCESSED FILES/i);
    expect(processedFilesLink).toBeInTheDocument();

    const predictedFilesLink = screen.getByText(/PREDICTED FILES/i);
    expect(predictedFilesLink).toBeInTheDocument();

    // const logoutLink = screen.getByText(/LOGOUT/i);
    // expect(logoutLink).toBeInTheDocument();

    const beapLogoImage = screen.getByAltText(/beapLogo/i);
    expect(beapLogoImage).toBeInTheDocument();

    const profileLogoImage = screen.getByAltText(/profileLogo/i);
    expect(profileLogoImage).toBeInTheDocument();
});
