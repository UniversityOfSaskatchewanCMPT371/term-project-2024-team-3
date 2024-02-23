import React from "react";
import { render, fireEvent } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

import HelpPopup from "./HelpPopup";
import userEvent from "@testing-library/user-event";

jest.mock(
  "./HelpPopup",
  () =>
    function () {
      return <span>HelpPopup</span>;
    },
);

test("TID 3.1. Renders HelpPopup component", () => {
  const dom = render(<HelpPopup />);

  // dom.getByText("? Help");

  // clicking the popup expand button
  const button = dom.container.querySelector("popupButton");

  if (button === null) {
    throw new Error("Button didnt render");
  } else {
    userEvent.click(button);
  }
});
