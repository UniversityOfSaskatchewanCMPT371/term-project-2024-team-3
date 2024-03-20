import React from "react";
import { render, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import useLogout from "../../shared/hooks/useLogout";

jest.mock("../../shared/hooks/useLogout");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("Logout", () => {
    const mockHandleLogout = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
        (useLogout as jest.Mock).mockImplementation(() => ({
            handleLogout: mockHandleLogout,
            isLoading: false,
            error: null,
        }));
    });

    it("T.14 should call handleLogout on render", async () => {
        render(<Logout />);

        await waitFor(() => expect(mockHandleLogout).toHaveBeenCalledTimes(1));
    });

    it("T4.15 should navigate to home page after logout", async () => {
        render(<Logout />);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });

    it("T4.16 should display loading state", () => {
        (useLogout as jest.Mock).mockImplementation(() => ({
            handleLogout: mockHandleLogout,
            isLoading: true,
            error: null,
        }));

        const { getByText } = render(<Logout />);

        expect(getByText("Logging out...")).toBeInTheDocument();
    });

    it("T4.17 should display error state", () => {
        const errorMessage = "Logout failed. Please try again.";
        (useLogout as jest.Mock).mockImplementation(() => ({
            handleLogout: mockHandleLogout,
            isLoading: false,
            error: errorMessage,
        }));

        const { getByText } = render(<Logout />);

        expect(getByText(errorMessage)).toBeInTheDocument();
    });
});
