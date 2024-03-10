import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
import HomePage from "./HomePage";

test(" TID 1.2. Render Home Page components", () => {
    const { getByText } = renderWithProvider(<HomePage />);
    getByText("BEAP ENGINE");
    getByText("Accurately Process Your Fitness Data");
    getByText("How To Contribute Data");
    getByText("BEAP Engine is a research project developed by Dr. Daniel Fuller", { exact: false });
});
