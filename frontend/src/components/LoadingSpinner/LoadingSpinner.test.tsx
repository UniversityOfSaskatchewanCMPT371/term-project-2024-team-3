import React from "react";
import { render } from "@testing-library/react";
import { HashLoader } from "react-spinners";
import LoadingSpinner from "./LoadingSpinner";

jest.mock("react-spinners", () => ({
    HashLoader: jest.fn(() => <div data-testid="mock-hash-loader" />),
}));

describe("LoadingSpinner", () => {
    it("renders the HashLoader with correct props when loading is true", () => {
        render(<LoadingSpinner loading />);
        expect(HashLoader).toHaveBeenCalledWith({ color: "#017176", loading: true, size: 100 }, {});
    });

    it("does not render the HashLoader when loading is false", () => {
        const { queryByTestId } = render(<LoadingSpinner loading={false} />);
        expect(queryByTestId("mock-hash-loader")).toBeNull();
    });
});
