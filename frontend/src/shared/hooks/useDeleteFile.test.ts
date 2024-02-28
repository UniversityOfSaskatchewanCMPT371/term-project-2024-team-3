import { renderHook } from "@testing-library/react-hooks";
import useDeleteFile from "./useDeleteFile";
import * as API from "../Data/index";
import { WatchType } from "shared/api";

const mockSetStorage = jest.fn();

jest.mock("../api");
jest.mock("usehooks-ts", () => ({
  useLocalStorage: () => ["", mockSetStorage],
}));

const deleteFileSpy = jest
  .spyOn(API, "deleteFile")
  .mockImplementation(async () => {});

const mockData = {
  id: "12345678",
  watchType: WatchType.APPLE_WATCH,
};

describe("useDeleteFile", () => {
  it("should handle delete successfully", async () => {
    const { result } = renderHook(useDeleteFile);

    await result.current.handleDelete(mockData.id, mockData.watchType);

    expect(deleteFileSpy).toHaveBeenCalledTimes(1);
    expect(deleteFileSpy).toHaveBeenCalledWith(mockData.id, mockData.watchType);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle delete when it errors", async () => {
    const { result } = renderHook(useDeleteFile);

    deleteFileSpy.mockImplementation(async () => {
      throw new Error("Delete failed");
    });
    await result.current.handleDelete(mockData.id, mockData.watchType);

    expect(deleteFileSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual("Delete File failed");
  });
});
