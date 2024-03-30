import React from "react";
import { render } from "@testing-library/react";
import LoadingModal from "./LoadingModal";

describe("Uploaded Files Page", () => {
    it("T5.?? should render loading modal", () => {
        const { getByText, getByTestId } = render(<LoadingModal header="Loading!" isVisible />);
        getByText("Loading!");
        getByTestId("spinner");
    });

    it("T5.?? should render null when loading modal is not visible", () => {
        const { queryByText, queryByTestId } = render(
            <LoadingModal header="Loading!" isVisible={false} />,
        );
        expect(queryByText("Loading!")).not.toBeInTheDocument();
        expect(queryByTestId("spinner")).not.toBeInTheDocument();
    });
});
