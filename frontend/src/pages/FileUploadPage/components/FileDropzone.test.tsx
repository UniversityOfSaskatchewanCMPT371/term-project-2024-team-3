import React from "react";
import { render } from "@testing-library/react";
import FileDropzone from "./FileDropzone";

jest.mock(
  "./FileDropzoneControls",
  () =>
    function () {
      return <span>FileDropzoneControls</span>;
    },
);

test(" TID 1.6. Renders FileDropzone components", () => {
  const { getByText } = render(<FileDropzone />);
  getByText("FileDropzoneControls");
  getByText("Drop files here, or click to select files");
});
