import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
import { BrowserRouter as Router } from "react-router-dom";
import HomePage from "./HomePage";
import AppleWatchPdf from "../../assets/AppleWatch.pdf";
import FitbitPdf from "../../assets/Fitbit.pdf";
import beapLogo from "../../assets/beap_lab_hex_small.png";
import engineOverview from "../../assets/engine-overview.png";

afterEach(() => {
    jest.clearAllMocks();
});

test(" TID 1.2. Render Home Page components", () => {
    const { getByText } = renderWithProvider(
        <Router>
            <HomePage />
        </Router>,
    );
    getByText("BEAP ENGINE");
    getByText("Unleashing The Power Of Your Fitness Data");
    getByText("How To Contribute Data");
    getByText("BEAP Engine is a research project developed by Dr. Daniel Fuller", { exact: false });
});

test(" TID 1.2.2. Extraction protocol links are correct", () => {
    const { getByText } = renderWithProvider(
        <Router>
            <HomePage />
        </Router>,
    );
    expect(getByText("Apple Watch Extraction Protocol").closest("a")).toHaveAttribute(
        "href",
        AppleWatchPdf,
    );
    expect(getByText("Fitbit Extraction Protocol").closest("a")).toHaveAttribute("href", FitbitPdf);
});

test(" TID 1.2.3. Footer links are correct", () => {
    const { getByText } = renderWithProvider(
        <Router>
            <HomePage />
        </Router>,
    );
    expect(getByText("Privacy Policy").closest("a")).toHaveAttribute("href", "/privacy-policy");
    expect(getByText("About Us").closest("a")).toHaveAttribute("href", "/about-us");
});

test(" TID 1.2.4. BEAP Lab link is correct", () => {
    const { getByText } = renderWithProvider(
        <Router>
            <HomePage />
        </Router>,
    );
    expect(
        getByText("Built Environment and Active Populations (BEAP) Lab").closest("a"),
    ).toHaveAttribute("href", "http://www.beaplab.com/home/");
});

test(" TID 1.2.5. Images are rendered correctly", () => {
    const { getByAltText } = renderWithProvider(
        <Router>
            <HomePage />
        </Router>,
    );
    expect(getByAltText("Beap Logo")).toHaveAttribute("src", beapLogo);
    expect(getByAltText("Beap engine overview")).toHaveAttribute("src", engineOverview);
});
