import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import * as UseAuth from "./useAuth";
import { AuthProvider } from "./useAuth";

describe("ProtectedRoute Component", () => {
    let authSpy: jest.SpyInstance;
    beforeEach(() => {
        authSpy = jest.spyOn(UseAuth, "useAuth").mockReturnValue({ isAuthenticated: true });
    });
    it("T4.34: renders children when user is authenticated", () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={["/protected"]}>
                <AuthProvider>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <div data-testid="protected-content">Protected</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>,
        );

        getByText("Protected");
    });

    it("T4.35: redirects to login when user is not authenticated", () => {
        authSpy.mockReturnValue({ isAuthenticated: false });
        const { queryByText } = render(
            <MemoryRouter initialEntries={["/protected"]}>
                <AuthProvider>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <div data-testid="protected-content">Protected</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>,
        );

        expect(queryByText("Protected")).not.toBeInTheDocument();
    });
});
