import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileDropzoneControls from "./FileDropzoneControls";

const onRadioChange = jest.fn();
test("Renders FileDropzoneControls components", () => {
    const { getByText } = render(<FileDropzoneControls onRadioChange={onRadioChange} />);
    getByText("Fitbit");
    getByText("Apple Watch");
    getByText("Select File Type:");
});

test(" TID 1.7. Should be able to click Fitbit or Apple Watch radio", () => {
    const { getByLabelText } = render(<FileDropzoneControls onRadioChange={onRadioChange} />);
    const fitbit = getByLabelText("Fitbit");
    const apple = getByLabelText("Apple Watch");

    // Test default fitbit
    expect(fitbit).toBeChecked();
    expect(apple).not.toBeChecked();

    // Test clicking apple watch
    userEvent.click(apple);
    expect(onRadioChange).toHaveBeenCalledWith(expect.anything(), "apple");
    expect(fitbit).not.toBeChecked();
    expect(apple).toBeChecked();

    // Test clicking apple watch
    userEvent.click(fitbit);
    expect(onRadioChange).toHaveBeenCalledWith(expect.anything(), "fitbit");
    expect(fitbit).toBeChecked();
    expect(apple).not.toBeChecked();
});
