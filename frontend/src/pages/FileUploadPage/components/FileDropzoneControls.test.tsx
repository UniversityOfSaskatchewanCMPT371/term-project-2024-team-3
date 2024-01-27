import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileDropzoneControls from "./FileDropzoneControls";

test("Renders FileDropzoneControls components", () => {
  const { getByText } = render(<FileDropzoneControls />);
  getByText("Fitbit");
  getByText("Apple Watch");
  getByText("Select File Type:");
});

test("Should be able to click Fitbit or Apple Watch radio", () => {
  const { getByLabelText } = render(<FileDropzoneControls />);
  const fitbit = getByLabelText("Fitbit");
  const apple = getByLabelText("Apple Watch");

  // Test clicking fitbit
  userEvent.click(fitbit);
  expect(fitbit).toBeChecked();
  expect(apple).not.toBeChecked();

  // Test clicking apple watch
  userEvent.click(apple);
  expect(fitbit).not.toBeChecked();
  expect(apple).toBeChecked();
});