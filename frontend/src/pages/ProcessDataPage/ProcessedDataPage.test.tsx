import React from "react";
import { renderWithProvider, waitFor } from "shared/util/tests/render";
import userEvent from "@testing-library/user-event";
import * as useGetProcessedDataList from "shared/hooks/useGetProcessedDataList";
import * as usePredictFile from "shared/hooks/usePredictFile";
import ProcessedDataPage from "./ProcessedDataPage";

const mockFitbitFiles = [
    {
        id: 123,
        data: null,
        predictedData: null,
        dateTime: new Date("2023-01-01"),
    },
    {
        id: 321,
        data: null,
        predictedData: null,
        dateTime: new Date("2023-04-21"),
    },
];

const mockFitbitData = {
    uploadedFiles: mockFitbitFiles,
    isLoading: false,
    error: null,
};

const mockAppleFiles = [
    {
        id: 987,
        data: null,
        predictedData: null,
        dateTime: new Date("2021-01-02"),
    },
    {
        id: 543,
        data: null,
        predictedData: null,
        dateTime: new Date("2003-9-11"),
    },
];

const mockAppleData = {
    uploadedFiles: mockAppleFiles,
    isLoading: false,
    error: null,
};

const callMockHandlePredict = jest.fn();
const predictMock = {
    handlePredict: callMockHandlePredict,
    isLoading: false,
    error: null,
};

describe("Processed Data Page", () => {
    it("Should properly display the processed data page", () => {
        jest.spyOn(useGetProcessedDataList, "default")
            .mockImplementationOnce(() => mockFitbitData)
            .mockImplementation(() => mockAppleData);

        jest.spyOn(usePredictFile, "default").mockImplementation(() => predictMock);

        const { getByText, getByLabelText } = renderWithProvider(<ProcessedDataPage />);

        // radials rendering and verifying that 1 can be checked at a time
        const SVMRad = getByLabelText("SVM");
        const RandomRad = getByLabelText("Random Forest");
        const DecissionRad = getByLabelText("Decission Tree");
        getByText("SVM");

        userEvent.click(SVMRad);
        expect(SVMRad).toBeChecked();
        expect(RandomRad).not.toBeChecked();
        expect(DecissionRad).not.toBeChecked();

        userEvent.click(RandomRad);
        expect(SVMRad).not.toBeChecked();
        expect(RandomRad).toBeChecked();
        expect(DecissionRad).not.toBeChecked();

        userEvent.click(DecissionRad);
        expect(SVMRad).not.toBeChecked();
        expect(RandomRad).not.toBeChecked();
        expect(DecissionRad).toBeChecked();

        // buttons rendering
        waitFor(() => {
            getByText("Predict File");
            getByText("Download File");
            getByText("DELETE FILE");

            getByText("987");
            getByText("123");
            getByText("321");
            getByText("543");

            getByText("2023/01/01");
            getByText("2023/04/21");
            getByText("2021/01/02");
            getByText("2003/9/11");
        });
    });
});
