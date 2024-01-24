import React from "react";
import { render } from "@testing-library/react";
import FileUploadPage from "./FileUploadPage";

test("Renders FileUploadPage components", () => {
  const { getByText } = render(<FileUploadPage />);
  getByText("Test");
});
