import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
import { screen } from "@testing-library/react";
import MaintenancePage from "./MaintenancePage";

afterEach(() => {
    jest.clearAllMocks();
});

describe("MaintenancePage component", () => {
    beforeEach(() => {
        renderWithProvider(<MaintenancePage />);
    });

    test("TID 1.1. Renders maintenance page title", () => {
        const title = screen.getByText("Website Under Maintenance");
        expect(title).toBeInTheDocument();
        expect(title.tagName).toBe("H3");
    });

    test("TID 1.1.1. Renders maintenance message paragraphs", () => {
        const message1 = screen.getByText(
            "We are currently doing major upgrades to the BeapEngine to accommodate changes to the data format for Fitbit devices",
        );
        const message2 = screen.getByText("Please check back soon!");
        expect(message1).toBeInTheDocument();
        expect(message2).toBeInTheDocument();
        expect(message1.tagName).toBe("P");
        expect(message2.tagName).toBe("P");
    });

    test("TID 1.1.2. Applies correct CSS classes", () => {
        const title = screen.getByText("Website Under Maintenance");
        const messageContainer = screen.getByText(
            "We are currently doing major upgrades to the BeapEngine to accommodate changes to the data format for Fitbit devices",
        ).parentElement;

        expect(title).toHaveClass("title");
        expect(messageContainer).toHaveClass("message");
    });
});
