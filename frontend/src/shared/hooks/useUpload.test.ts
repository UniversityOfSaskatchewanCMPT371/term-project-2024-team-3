import { renderHook } from "@testing-library/react-hooks";
import { WatchType } from "shared/api";
import useUpload from "./useUpload";
import * as API from "../Data";

jest.mock("../Data");

const mockFormData = new FormData();

const uploadSpy = jest.spyOn(API, "upload").mockImplementation(async () => {});

describe("useUpload", () => {
  it("should handle uploads successfully", async () => {
    const { result } = renderHook(useUpload);
    await result.current.handleUpload(
      mockFormData,
      "2020",
      WatchType.APPLE_WATCH,
    );

    expect(uploadSpy).toHaveBeenCalledWith(
      mockFormData,
      "2020",
      WatchType.APPLE_WATCH,
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle errors", async () => {
    uploadSpy.mockImplementation(async () => {
      throw new Error("Upload Failed");
    });

    const { result } = renderHook(useUpload);
    await result.current.handleUpload(
      mockFormData,
      "2020",
      WatchType.APPLE_WATCH,
    );

    expect(uploadSpy).toHaveBeenCalledWith(
      mockFormData,
      "2020",
      WatchType.APPLE_WATCH,
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Upload failed. Please Try Again.");
  });
});
