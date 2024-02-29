import React from "react";
import { render } from "@testing-library/react";
import FileUploadPage from "./FileUploadPage";

jest.mock(
  "./components/FileDropzone",
  () =>
    function () {
      return <span>FileDropZone</span>;
    },
);

test("TID 1.1. Renders FileUploadPage components", () => {
  const { getByText } = render(<FileUploadPage />);
  getByText("FileDropZone");
});
