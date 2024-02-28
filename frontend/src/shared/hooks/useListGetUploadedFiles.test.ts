import { renderHook } from "@testing-library/react-hooks";
import useListUploadedFiles from "./useListUploadedFiles";
import * as API from "../Data/index";
import { DataType, WatchType } from "shared/api";

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
      type: DataType.APPLE_WATCH,
      processedDataId: 20,
      dateTime: new Date(),
    },
  ],
};

const getUploadedFileSpy = jest
  .spyOn(API, "getUploadedFiles")
  .mockImplementation(async () => mockData);

describe("useListGetUploadedFiles", () => {
  it("should get uploaded files successfully", async () => {
    const { result } = renderHook(useListUploadedFiles);

    expect(getUploadedFileSpy).toHaveBeenCalledTimes(1);
    // expect(getUploadedFileSpy).toHaveBeenCalledWith(mockData.id, mockData.watchType);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle getUploadedFiles when it errors", async () => {
    const { result } = renderHook(useListUploadedFiles);

    getUploadedFileSpy.mockImplementation(async () => {
      throw new Error("Delete failed");
    });

    expect(getUploadedFileSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(
      `An error occured while getting uploaded files: Delete failed`,
    );
  });
});
