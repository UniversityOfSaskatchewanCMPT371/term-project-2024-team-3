import { renderHook } from "@testing-library/react-hooks";
import { DataType, WatchType } from "shared/api";
import { waitFor } from "@testing-library/react";
import useGetUploadedFiles from "./useGetUploadedFiles";
import * as API from "../Data/index";

jest.mock("../api");

const mockData = {
    list: [
        {
            id: 123,
            data: new Uint8Array([1, 2]),
            type: DataType.APPLE_WATCH,
            processedDataID: 20,
            dateTime: "",
        },
    ],
};

const getUploadedFileSpy = jest
    .spyOn(API, "getUploadedFiles")
    .mockImplementation(async () => mockData);

describe("useGetUploadedFiles", () => {
    it("T3.19 should get uploaded files successfully", async () => {
        getUploadedFileSpy.mockResolvedValue(mockData);

        const { result } = renderHook(() => useGetUploadedFiles(WatchType.FITBIT));

        expect(getUploadedFileSpy).toHaveBeenCalledTimes(1);
        // expect(getUploadedFileSpy).toHaveBeenCalledWith(mockData.id, mockData.watchType);

        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(null);
        });
    });

    it("T3.20 should handle getUploadedFiles when it errors", async () => {
        const { result } = renderHook(() => useGetUploadedFiles(WatchType.APPLE_WATCH));

        getUploadedFileSpy.mockImplementation(async () => {
            throw new Error("Delete failed");
        });

        expect(getUploadedFileSpy).toHaveBeenCalledTimes(1);

        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toEqual(
                `An error occured while getting uploaded files: Delete failed`,
            );
        });
    });
});
