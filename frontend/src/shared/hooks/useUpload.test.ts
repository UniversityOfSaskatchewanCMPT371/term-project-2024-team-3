import { renderHook } from "@testing-library/react-hooks";
import { WatchType } from "shared/api";
import { waitFor } from "@testing-library/react";
import useUpload from "./useUpload";
import * as API from "../Data";

jest.mock("../Data");

const mockFormData = new FormData();

const uploadSpy = jest.spyOn(API, "upload").mockImplementation(async () => {});

describe("useUpload", () => {
    it("should handle uploads successfully", async () => {
        const { result } = renderHook(useUpload);
        await result.current.handleUpload(mockFormData, "2020", WatchType.APPLE_WATCH);

        expect(uploadSpy).toHaveBeenCalledWith(mockFormData, "2020", WatchType.APPLE_WATCH);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("should handle errors", async () => {
        const errorMessage = "Upload Failed";
        uploadSpy.mockImplementation(async () => {
            throw new Error(errorMessage);
        });

        const { result } = renderHook(useUpload);

        try {
            await result.current.handleUpload(mockFormData, "2020", WatchType.APPLE_WATCH);
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(uploadSpy).toHaveBeenCalledWith(mockFormData, "2020", WatchType.APPLE_WATCH);
        expect(result.current.error).toBe(`${errorMessage}. Please try again later!`);
    });
});
