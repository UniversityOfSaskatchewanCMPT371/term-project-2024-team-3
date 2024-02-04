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
  getByText("Step 1:");
  getByText(
    "Drag and drop your files into the upload box. Once uploaded your files will appear in the",
  );
  getByText("Uploaded Files");
  getByText("Go To Processed Files");
  getByText("to move to the processed data menu.");
  getByText(
    "section on the right. You can select the file you want to process and click the process button. Once you have processed your data it will be saved. You do not need to process it again. Click",
  );
});
