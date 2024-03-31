import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProvider } from "shared/util/tests/render";
import AboutUs from "./AboutUs";

global.IntersectionObserver = class IntersectionObserver {
    disconnect() {
        return null;
    }

    observe() {
        return null;
    }

    takeRecords() {
        return [];
    }

    unobserve() {
        return null;
    }

    root = null;

    rootMargin = "";

    thresholds = [0];
};

describe("AboutUs component", () => {
    beforeEach(() => {
        renderWithProvider(<AboutUs />);
    });

    describe("Logo", () => {
        it("renders the BEAP logo", () => {
            const logo = screen.getByAltText("Beap Logo");
            expect(logo).toBeInTheDocument();
        });
    });

    describe("Title", () => {
        it("renders the main title", () => {
            const title = screen.getByText("About Us");
            expect(title).toBeInTheDocument();
        });
    });

    describe("Sections", () => {
        it("renders the Our Mission section", () => {
            const missionTitle = screen.getByText("Our Mission");
            expect(missionTitle).toBeInTheDocument();
        });

        it("renders the Contributors section", () => {
            const contributorsTitle = screen.getByText("Contributors");
            expect(contributorsTitle).toBeInTheDocument();
        });
    });

    describe("Contributors", () => {
        it("renders the contributors", () => {
            const contributor = screen.getByText("Dr. Daniel Fuller (PhD Public Health)");
            expect(contributor).toBeInTheDocument();
        });
    });
});
