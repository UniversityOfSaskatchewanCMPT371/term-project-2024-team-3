import { renderHook } from "@testing-library/react-hooks";
import { WatchType } from "shared/api";
import { waitFor } from "@testing-library/react";
import useGetProcessedDataList from "./useGetProcessedDataList";
import * as API from "../Data/index";
// import { DataType, WatchType } from "shared/api";

jest.mock("../api");

const mockData = {
  list: [
    {
      id: 123,
      data: new Uint8Array([1, 2]),
      predictedData: {
        id: 321,
        data: new Uint8Array([1, 2, 3, 4]),
        predictionType: null,
        dateTime: new Date(),
      },
      dateTime: new Date(),
    },
  ],
};

const getProcessedFilesSpy = jest
  .spyOn(API, "getProcessedDataList")
  .mockImplementation(async () => mockData);

describe("useListGetProcessedFiles", () => {
  it("should get processed files successfully", async () => {
    getProcessedFilesSpy.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useGetProcessedDataList(WatchType.APPLE_WATCH),
    );

    expect(getProcessedFilesSpy).toHaveBeenCalledTimes(1);
    waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBe(null);
  });

  it("should handle getProcessedFiles when it errors", async () => {
    getProcessedFilesSpy.mockImplementation(async () => {
      throw new Error("Getting processed failed");
    });

    const { result } = renderHook(() =>
      useGetProcessedDataList(WatchType.APPLE_WATCH),
    );

    expect(getProcessedFilesSpy).toHaveBeenCalledTimes(1);
    waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toEqual(
        `An error occured while getting processed files Getting processed failed`,
      );
    });
  });
});
