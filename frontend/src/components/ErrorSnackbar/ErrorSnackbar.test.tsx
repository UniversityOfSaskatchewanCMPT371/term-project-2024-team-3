import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
import ErrorSnackbar from "./ErrorSnackbar";

describe("Error Snackbar", () => {
    it("T5.06 Should return null if error is null", () => {
        const { queryByTestId } = renderWithProvider(<ErrorSnackbar error={null} />);

        expect(queryByTestId("errorSnackbar")).not.toBeInTheDocument();
        expect(queryByTestId("errorAlert")).not.toBeInTheDocument();
    });

    it("T5.07 Should render snackbar if error is defined", () => {
        const { getByTestId, getByText } = renderWithProvider(
            <ErrorSnackbar error="This is a error" />,
        );

        getByTestId("errorSnackbar");
        getByTestId("errorAlert");
        getByText("This is a error");
    });
});
