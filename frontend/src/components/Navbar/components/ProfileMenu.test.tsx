import React from "react";
import { act, render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ProfileMenu from "./ProfileMenu";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const logoutMock = jest.fn();
describe("Profile Menu", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    });

    it("T5.112 should render profile while not clicked", () => {
        const { queryByText, getByTestId } = render(<ProfileMenu onLogout={logoutMock} />);
        getByTestId("profile");
        expect(queryByText("My account")).not.toBeInTheDocument();
        expect(queryByText("Logout")).not.toBeInTheDocument();
    });

    it("T5.113 should render profile and dropdown while clicked", () => {
        const { getByText, getByTestId } = render(<ProfileMenu onLogout={logoutMock} />);
        act(() => {
            userEvent.click(getByTestId("profile"));
        });
        getByText("My account");
        getByText("Logout");
    });

    it("T5.114 should call logout and my account nav links when clicked", () => {
        const { getByText, getByTestId } = render(<ProfileMenu onLogout={logoutMock} />);
        act(() => {
            userEvent.click(getByTestId("profile"));
        });
        act(() => {
            userEvent.click(getByText("My account"));
        });
        expect(mockNavigate).toHaveBeenCalledWith("/profile");

        act(() => {
            userEvent.click(getByText("Logout"));
        });
        expect(logoutMock).toHaveBeenCalledTimes(1);
    });
});
