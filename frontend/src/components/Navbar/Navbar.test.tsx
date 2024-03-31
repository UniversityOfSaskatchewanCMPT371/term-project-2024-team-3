import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
import { BrowserRouter as Router } from "react-router-dom";
import * as useAuth from "components/Authentication/useAuth";
import * as useLogout from "shared/hooks/useLogout";
import Navbar from "./Navbar";

// Define the type for the mock return value of useAuth
type AuthReturnValue = {
    isAuthenticated: boolean;
};

describe("Navbar", () => {
    let authSpy: jest.SpyInstance;
    let logoutSpy: jest.SpyInstance;
    const mockLogout = jest.fn();

    beforeEach(() => {
        authSpy = jest
            .spyOn(useAuth, "useAuth")
            .mockReturnValue({ isAuthenticated: true } as AuthReturnValue);
        logoutSpy = jest.spyOn(useLogout, "default").mockReturnValue({
            handleLogout: mockLogout,
            isLoading: false,
            error: null,
        });
    });

    it("renders all links when user is authenticated", () => {
        const { getByText, getByAltText } = renderWithProvider(
            <Router>
                <Navbar />
            </Router>,
        );

        const fileUploadLink = getByText(/FILE UPLOAD/i);
        expect(fileUploadLink).toBeInTheDocument();

        const processedFilesLink = getByText(/PROCESSED FILES/i);
        expect(processedFilesLink).toBeInTheDocument();

        const predictedFilesLink = getByText(/PREDICTED FILES/i);
        expect(predictedFilesLink).toBeInTheDocument();

        const beapLogoImage = getByAltText(/beapLogo/i);
        expect(beapLogoImage).toBeInTheDocument();

        const profileLogoImage = getByAltText(/profileLogo/i);
        expect(profileLogoImage).toBeInTheDocument();
    });

    it("does not render when user is not authenticated", () => {
        authSpy.mockReturnValue({ isAuthenticated: false } as AuthReturnValue);
        const { container } = renderWithProvider(
            <Router>
                <Navbar />
            </Router>,
        );

        expect(container.firstChild).toBeNull();
    });

    it("should show modal while logout is loading", () => {
        logoutSpy.mockReturnValue({
            handleLogout: mockLogout,
            isLoading: true,
            error: null,
        });
        const { getByText } = renderWithProvider(
            <Router>
                <Navbar />
            </Router>,
        );

        getByText("Please wait while we are logging you out!");
    });
});
