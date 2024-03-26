import React from "react";
import { render } from "@testing-library/react";
import ProfilePage from "./ProfilePage";

describe("Profile Page", () => {
    it("T5.?? should render profile page", () => {
        const { getByText, queryByText } = render(
            <ProfilePage />,
        );
        getByText("Manage your account");
        getByText("Your account details");
        getByText("Personal information");
        getByText("First Name");
        getByText("Last Name");
        getByText("Login information");
        getByText("Username");
        expect(queryByText("New Password")).not.toBeInTheDocument();
        expect(queryByText("Confirm Password")).not.toBeInTheDocument();
        expect(queryByText("Update My Password")).not.toBeInTheDocument();
        getByText("Change My Password");
        getByText("Delete My Account");
        getByText("Delete My Data");
    });
});
