import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProvider } from "shared/util/tests/render";
import PrivacyPolicy from "./PrivacyPolicy";

describe("PrivacyPolicy component", () => {
    beforeEach(() => {
        renderWithProvider(<PrivacyPolicy />);
    });

    describe("Logo", () => {
        it("renders the BEAP logo", () => {
            const logo = screen.getByAltText("Beap Logo");
            expect(logo).toBeInTheDocument();
        });
    });

    describe("Titles", () => {
        it("renders the main title", () => {
            const title = screen.getByText("Consent to Take Part in Research");
            expect(title).toBeInTheDocument();
        });

        it("renders the subtitle", () => {
            const subtitle = screen.getByText("BEAPEngine");
            expect(subtitle).toBeInTheDocument();
        });
    });

    describe("Researcher Info", () => {
        it("renders the researcher info", () => {
            const researcherInfo = screen.getByText(/Researcher\(s\): Dr\. Daniel Fuller/);
            expect(researcherInfo).toBeInTheDocument();
        });
    });

    describe("Section Titles", () => {
        it("renders title of Introduction", () => {
            const introTitle = screen.getByText("Introduction/ Background to the study");
            expect(introTitle).toBeInTheDocument();
        });

        it("renders title of Purpose of Study", () => {
            const purposeTitle = screen.getByText("Purpose of the study");
            expect(purposeTitle).toBeInTheDocument();
        });

        it("renders questions or concerns title", () => {
            const questionsTitle = screen.getByText("Questions or Concerns");
            expect(questionsTitle).toBeInTheDocument();
        });
        it("renders title of Privacy and Confidentiality", () => {
            const privacyTitle = screen.getByText("Privacy and Confidentiality");
            expect(privacyTitle).toBeInTheDocument();
        });
        it("renders title of Anonymity", () => {
            const anonymityTitle = screen.getByText("Anonymity");
            expect(anonymityTitle).toBeInTheDocument();
        });
        it("renders title of Storage of Data", () => {
            const storageTitle = screen.getByText("Storage of Data");
            expect(storageTitle).toBeInTheDocument();
        });
    });

    describe("Section Contents", () => {
        it("renders the content of the Introduction section", () => {
            const introContent = screen.getByText(
                /Smartphones and smart devices \(e\.g\. Apple Watches\) have become more affordable/,
            );
            expect(introContent).toBeInTheDocument();
        });

        it("renders the content of the Purpose of Study section", () => {
            const purposeContent = screen.getByText(
                /Our purpose of this study is to collect and analyze large volumes of Apple Watch and Fitbit data/,
            );
            expect(purposeContent).toBeInTheDocument();
        });

        it("renders the content of the Questions or Concerns section", () => {
            const questionsContent = screen.getByText(
                /If you have any questions about taking part in this study/,
            );
            expect(questionsContent).toBeInTheDocument();
        });

        it("renders the content of the Privacy and Confidentiality section", () => {
            const privacyContent = screen.getByText(
                /Confidentiality is ensuring that identities of participants are accessible only to those authorized to have access/,
            );
            expect(privacyContent).toBeInTheDocument();
        });

        it("renders the content of the Anonymity section", () => {
            const anonymityContent = screen.getByText(
                /We will not release individual information collected related to your height, weight, age, or gender/,
            );
            expect(anonymityContent).toBeInTheDocument();
        });

        it("renders the content of the Storage of Data section", () => {
            const storageContent = screen.getByText(
                /Therefore, anonymity and confidentiality of data may not be guaranteed in the rare instance, for example, that government agencies obtain a court order compelling the provider to grant access to specific data stored on their servers/,
            );
            expect(storageContent).toBeInTheDocument();
        });
    });
});
