import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "./ConfirmModal";

const onConfirmMock = jest.fn();
const onCloseMock = jest.fn();

describe("Uploaded Files Page", () => {
    it("T5.95 should render confirm modal", () => {
        const { getByText } = render(
            <ConfirmModal
                header="Header"
                content="Content"
                onConfirm={onConfirmMock}
                onClose={onCloseMock}
                isVisible
            />,
        );
        getByText("Header");
        getByText("Content");
        getByText("Cancel");
        getByText("Confirm");
    });

    it("T5.96 should render null when confirm modal is not visible", () => {
        const { queryByText } = render(
            <ConfirmModal
                header="Header"
                content="Content"
                onConfirm={onConfirmMock}
                onClose={onCloseMock}
                isVisible={false}
            />,
        );
        expect(queryByText("Header")).not.toBeInTheDocument();
        expect(queryByText("Content")).not.toBeInTheDocument();
        expect(queryByText("Cancel")).not.toBeInTheDocument();
        expect(queryByText("Confirm")).not.toBeInTheDocument();
    });

    it("T5.97 should call onClose when cancel button clicked", () => {
        const { getByTestId } = render(
            <ConfirmModal
                header="Header"
                content="Content"
                onConfirm={onConfirmMock}
                onClose={onCloseMock}
                isVisible
            />,
        );

        userEvent.click(getByTestId("cancelBtn"));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
        expect(onConfirmMock).not.toHaveBeenCalled();
    });

    it("T5.98 should call onConfirm when confirm button clicked", () => {
        const { getByTestId } = render(
            <ConfirmModal
                header="Header"
                content="Content"
                onConfirm={onConfirmMock}
                onClose={onCloseMock}
                isVisible
            />,
        );

        userEvent.click(getByTestId("confirmBtn"));
        expect(onCloseMock).not.toHaveBeenCalled();
        expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });

    it("T5.99 should disable the confirm and cancel button when isLoading is true", () => {
        const { getByTestId } = render(
            <ConfirmModal
                header="Header"
                content="Content"
                onConfirm={onConfirmMock}
                onClose={onCloseMock}
                isVisible
                isLoading
            />,
        );

        expect(getByTestId("cancelBtn")).toBeDisabled();
        expect(getByTestId("confirmBtn")).toBeDisabled();
    });
});
