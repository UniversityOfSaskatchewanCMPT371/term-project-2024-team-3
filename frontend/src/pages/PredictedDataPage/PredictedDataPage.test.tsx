import React from "react";
import { renderWithProvider } from "shared/util/tests/render";
import userEvent from "@testing-library/user-event";
import * as useGetPredictedDataList from "shared/hooks/useGetPredictedDataList";
import * as useDownload from "shared/hooks/useDownload";
import PredictedDataPage from "./PredictedDataPage";

const mockFitbitFiles = [
    {
        id: 987,
        data: null,
        predictionType: null,
        dateTime: new Date("2021-01-02"),
    },
    {
        id: 543,
        data: null,
        predictionType: null,
        dateTime: new Date("2003-9-11"),
    },
];

const mockFitbitData = {
    uploadedFiles: mockFitbitFiles,
    isLoading: false,
    error: null,
};

const downloadMock = jest.fn();

describe("Predicted Data Page", () => {
    beforeEach(() => {
        jest.spyOn(useGetPredictedDataList, "default").mockImplementation(() => mockFitbitData);
        jest.spyOn(useDownload, "default").mockReturnValue({
            handleDownload: downloadMock,
            isLoading: false,
            isDownloading: false,
            error: null,
        });
    });
    it("T5.?? Should properly display the predicted data page and download file", () => {
        const { getByTestId, getByText } = renderWithProvider(<PredictedDataPage />);

        getByTestId("page-info");
        const fitbitFile = getByText("FitBit 987");

        userEvent.click(fitbitFile);
        userEvent.click(getByText("Download File"));

        expect(downloadMock).toHaveBeenCalledWith("987", "predict", "fitbit");
    });
});
