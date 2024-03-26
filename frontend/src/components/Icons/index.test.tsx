import React from "react";
import { render } from "@testing-library/react";
import FileIcon from ".";

const onConfirmMock = jest.fn();
const onCloseMock = jest.fn();

describe("Icons", () => {
    it("T5.?? should render file icon", () => {
        const { getByTestId } = render(
            <FileIcon />,
        );
        getByTestId("file-icon");
    });
});
