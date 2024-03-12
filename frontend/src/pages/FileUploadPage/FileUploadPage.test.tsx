import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
import FileUploadPage from "./FileUploadPage";

jest.mock(
    "./components/FileDropzone",
    () =>
        function () {
            return <span>FileDropZone</span>;
        },
);

test("TID 1.1. Renders FileUploadPage components", () => {
    const { getByText } = renderWithProvider(<FileUploadPage />);
    getByText("FileDropZone");
});
