import React from "react";
import { renderWithProvider, waitFor } from "shared/util/tests/render";
import userEvent from "@testing-library/user-event";
import * as useGetUploadedFiles from "shared/hooks/useGetUploadedFiles";
import * as useProcessFile from "shared/hooks/useProcessFile";
import { DataType } from "shared/api";
import UploadedFiles from "./UploadedFiles";

const mockFitbitRawFileData = [
    {
        id: 1,
        data: null,
        type: DataType.FITBIT,
        processedDataID: -1,
        dateTime: "2021-01-02",
    },
];

const mockAppleRawFileData = [
    {
        id: 2,
        data: null,
        type: DataType.APPLE_WATCH,
        processedDataID: -1,
        dateTime: "2021-01-02",
    },
    {
        id: 3,
        data: null,
        type: DataType.APPLE_WATCH,
        processedDataID: 2,
        dateTime: "2021-01-02",
    },
];

const mockAppleData = {
    uploadedFiles: mockAppleRawFileData,
    isLoading: false,
    error: null,
};

const mockFitbitData = {
    uploadedFiles: mockFitbitRawFileData,
    isLoading: false,
    error: null,
};

const mockOnProgressChange = jest.fn();
const mockHandleProcess = jest.fn();
const predictMock = {
    handleProcess: mockHandleProcess,
    isLoading: false,
    error: null,
};

describe("Uploaded Files Page", () => {
    beforeEach(() => {
        jest.spyOn(useGetUploadedFiles, "default")
            .mockReturnValueOnce(mockFitbitData)
            .mockReturnValue(mockAppleData);
        jest.spyOn(useProcessFile, "default").mockReturnValue(predictMock);
    });

    it("T5.10 Should properly render uploaded files with fitbit and apple data with -1 processedId", () => {
        const { getByText, getByTestId, getAllByText } = renderWithProvider(
            <UploadedFiles refetch={false} onProgressChange={mockOnProgressChange} />,
        );
        getByText("AppleWatch - 2");
        getByText("Fitbit - 1");
        expect(getAllByText("Sat, 2 Jan 2021, 12:00:00 AM")).toHaveLength(2);
        getByTestId("processBtn");
    });

    it("T5.11 On process click process all checked files and call onProgress fn", () => {
        const { getByText, getByTestId } = renderWithProvider(
            <UploadedFiles refetch={false} onProgressChange={mockOnProgressChange} />,
        );

        waitFor(() => {
            userEvent.click(getByTestId("1-cbox"));
            userEvent.click(getByTestId("2-cbox"));
            getByText("Process 2 files");
        });

        userEvent.click(getByTestId("processBtn"));
        expect(mockOnProgressChange).toHaveBeenCalled();
        expect(mockHandleProcess).toHaveBeenCalled();
    });
});
