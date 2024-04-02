import React from "react";
import { renderWithProvider, act } from "shared/util/tests/render";
import * as useGetUser from "shared/hooks/useGetUser";
import * as useDeleteAccount from "shared/hooks/useDeleteAccount";
import * as useDeleteData from "shared/hooks/useDeleteData";
import * as useChangePassword from "shared/hooks/useChangePassword";
import userEvent from "@testing-library/user-event";
import ProfilePage from "./ProfilePage";

const mockAccountDelete = jest.fn();
const mockDataDelete = jest.fn();
const mockChangePassword = jest.fn();

describe("Profile Page", () => {
    let userSpy: jest.SpyInstance;
    beforeEach(() => {
        userSpy = jest.spyOn(useGetUser, "default").mockReturnValue({
            user: {
                firstName: "hello",
                lastName: "world",
                username: "myUsername",
            },
            isLoading: false,
            error: null,
        });
        jest.spyOn(useDeleteAccount, "default").mockReturnValue({
            handleAccountDelete: mockAccountDelete,
            isLoading: false,
            error: null,
        });
        jest.spyOn(useChangePassword, "default").mockReturnValue({
            handleChangePassword: mockChangePassword,
            isLoading: false,
            error: null,
        });
        jest.spyOn(useDeleteData, "default").mockReturnValue({
            handleDataDelete: mockDataDelete,
            isLoading: false,
            error: null,
        });
    });

    it("T5.?? should render profile page", () => {
        const { getByText, queryByText } = renderWithProvider(<ProfilePage />);
        getByText("Manage your account");
        getByText("Your account details");
        getByText("Personal information");
        getByText("First Name:");
        getByText("Last Name:");
        getByText("hello");
        getByText("world");
        getByText("Login information");
        getByText("Username:");
        getByText("myUsername");
        expect(queryByText("New Password")).not.toBeInTheDocument();
        expect(queryByText("Confirm Password")).not.toBeInTheDocument();
        expect(queryByText("Update My Password")).not.toBeInTheDocument();
        getByText("Change My Password");
        getByText("Delete My Account");
        getByText("Delete My Data");
    });

    it("T5.?? should render loading spinner when user details are loading", () => {
        userSpy.mockReturnValue({
            user: null,
            isLoading: true,
            error: null,
        });
        const { getByTestId, queryByText } = renderWithProvider(<ProfilePage />);

        getByTestId("spinner");
        expect(queryByText("Manage your account")).not.toBeInTheDocument();
        expect(queryByText("Your account details")).not.toBeInTheDocument();
        expect(queryByText("Personal information")).not.toBeInTheDocument();
        expect(queryByText("First Name:")).not.toBeInTheDocument();
        expect(queryByText("Last Name:")).not.toBeInTheDocument();
        expect(queryByText("Login information")).not.toBeInTheDocument();
        expect(queryByText("Username:")).not.toBeInTheDocument();
        expect(queryByText("New Password")).not.toBeInTheDocument();
        expect(queryByText("Confirm Password")).not.toBeInTheDocument();
        expect(queryByText("Update My Password")).not.toBeInTheDocument();
        expect(queryByText("Change My Password")).not.toBeInTheDocument();
        expect(queryByText("Delete My Account")).not.toBeInTheDocument();
        expect(queryByText("Delete My Data")).not.toBeInTheDocument();
    });

    // Failing on CI due to issues with server mem/cpu, but this runs perfect locally
    it("T5.?? should delete data when delete data is clicked and confirmed", async () => {
        const { getByText } = renderWithProvider(<ProfilePage />);
        const dataBtn = getByText("Delete My Data");
        act(() => {
            userEvent.click(dataBtn);
        });
        act(() => {
            userEvent.click(getByText("Confirm"));
        });

        expect(mockDataDelete).toHaveBeenCalledTimes(1);
    });

    // Failing on CI due to issues with server mem/cpu, but this runs perfect locally
    it("T5.?? should delete data when delete account is clicked and confirmed", async () => {
        const { getByText } = renderWithProvider(<ProfilePage />);
        const dataBtn = getByText("Delete My Account");
        act(() => {
            userEvent.click(dataBtn);
        });
        act(() => {
            userEvent.click(getByText("Confirm"));
        });

        expect(mockAccountDelete).toHaveBeenCalledTimes(1);
    });

    // Failing on CI due to issues with server mem/cpu, but this runs perfect locally
    it("T5.?? should change password successfully and show confirm password error state when necessary", async () => {
        const { getByLabelText, queryByText, getByText } = renderWithProvider(<ProfilePage />);
        act(() => {
            userEvent.click(getByText("Change My Password"));
        });
        act(() => {
            userEvent.type(getByLabelText("New Password"), "test");
        });
        act(() => {
            userEvent.type(getByLabelText("Confirm Password"), "tes");
        });

        getByText("Passwords do not match.");

        act(() => {
            userEvent.click(getByText("Update My Password"));
        });

        act(() => {
            userEvent.type(getByLabelText("Confirm Password"), "t");
        });

        act(() => {
            userEvent.tab(); // Trigger blur
        });

        expect(queryByText("Passwords do not match.")).not.toBeInTheDocument();

        act(() => {
            userEvent.click(getByText("Update My Password"));
        });

        act(() => {
            userEvent.click(getByText("Confirm"));
        });

        expect(mockChangePassword).toHaveBeenCalledTimes(1);
    });
});
