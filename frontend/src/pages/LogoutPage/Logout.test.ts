import React from "react";
import { render, waitFor, RenderResult } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import useLogout from "../../shared/hooks/useLogout";
import '@testing-library/jest-dom/extend-expect';

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

jest.mock("../../shared/hooks/useLogout", () => jest.fn());

describe("Logout", () => {
    it("calls handleLogout and redirects to home page", async () => {
        const mockNavigate = jest.fn();
        const mockHandleLogout = jest.fn().mockResolvedValue(undefined);

        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useLogout as jest.Mock).mockReturnValue({
            handleLogout: mockHandleLogout,
            isLoading: false,
            error: null,
        });

        render(<Logout />);

        await waitFor(() => {
            expect(mockHandleLogout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("displays loading state", () => {
        (useLogout as jest.Mock).mockReturnValue({
            handleLogout: jest.fn(),
            isLoading: true,
            error: null,
        });

        const { getByText }: RenderResult = render(<Logout />);
        expect(getByText("Logging out...")).toBeInTheDocument();
    });

    it("displays error state", () => {
        const mockError = "An error occurred";
        (useLogout as jest.Mock).mockReturnValue({
            handleLogout: jest.fn(),
            isLoading: false,
            error: mockError,
        });

        const { getByText }: RenderResult = render(<Logout />);
        expect(getByText(mockError)).toBeInTheDocument();
    });
});
