import { renderHook } from "@testing-library/react-hooks";
import useGetProcessedDataList from "./useGetProcessedDataList";
import * as API from "../Data/index";
// import { DataType, WatchType } from "shared/api";

const mockSetStorage = jest.fn();

jest.mock("../api");
jest.mock("usehooks-ts", () => ({
  useLocalStorage: () => ["", mockSetStorage],
}));

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

describe("useListGetUploadedFiles", () => {
  it("should get uploaded files successfully", async () => {
    const { result } = renderHook(useGetProcessedDataList);

    expect(getProcessedFilesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle getUploadedFiles when it errors", async () => {
    const { result } = renderHook(useGetProcessedDataList);

    getProcessedFilesSpy.mockImplementation(async () => {
      throw new Error("Delete failed");
    });

    expect(getProcessedFilesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(
      `An error occured while getting uploaded files: Delete failed`,
    );
  });
});
