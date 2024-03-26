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

jest.mock(
    "./components/FileDropzoneControls",
    () =>
        function () {
            return <span>FileDropzoneControls</span>;
        },
);

jest.mock(
    "./components/UploadedFiles",
    () =>
        function () {
            return <span>UploadedFiles</span>;
        },
);

test("TID 1.1. Renders FileUploadPage components", () => {
    const { getByText } = renderWithProvider(<FileUploadPage />);
    getByText("FileDropZone");
    getByText("FileDropzoneControls");
    getByText("UploadedFiles");
});
