import React from "react";
import { render } from "@testing-library/react";
import HomePage from "./HomePage";

test("Render Home Page components", () => {
  const { getByText } = render(<HomePage />);
  getByText("BEAP ENGINE");
  getByText("Accurately Process Your Fitness Data");
  getByText("How To Contribute Data");
  getByText(
    "BEAP Engine is a research project developed by Dr. Daniel Fuller",
    { exact: false },
  );
});
