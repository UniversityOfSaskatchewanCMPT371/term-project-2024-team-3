import { renderHook } from "@testing-library/react-hooks";
import { WatchType } from "shared/api";
import { waitFor } from "@testing-library/react";
import useGetPredictedDataList from "./useGetPredictedDataList";

import * as API from "../Data/index";
// import { DataType, WatchType } from "shared/api";

jest.mock("../api");

const mockData = {
    // find out what kind of data the useGetPredictedDataList hook expects
    list: [
        {
            id: 123,
            data: new Uint8Array([1, 2]),
            predictionType: null,
            dateTime: new Date(),
        },
        {
            id: 456,
            data: new Uint8Array([5, 6]),
            predictionType: null,
            dateTime: new Date(),
        },
    ],
};

const getPredictedFilesSpy = jest
    .spyOn(API, "getPredictedDataList")
    .mockImplementation(async () => mockData);

describe("useGetPredictedDataList", () => {
    it("T4.25 should get predicted files successfully", async () => {
        getPredictedFilesSpy.mockResolvedValue(mockData);

        const { result } = renderHook(() => useGetPredictedDataList(WatchType.APPLE_WATCH));

        expect(getPredictedFilesSpy).toHaveBeenCalledTimes(1);
        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
        expect(result.current.error).toBe(null);
    });

    it("T4.26 should handle getPredictedFiles when it errors", async () => {
        getPredictedFilesSpy.mockImplementation(async () => {
            throw new Error("Getting predicted file list failed.");
        });

        const { result } = renderHook(() => useGetPredictedDataList(WatchType.APPLE_WATCH));

        expect(getPredictedFilesSpy).toHaveBeenCalledTimes(1);
        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toEqual(
                `An error occured while getting predicted files. Getting processed failed.`,
            );
        });
    });
});
