import { renderHook } from "@testing-library/react-hooks";
import { WatchType } from "shared/api";
import { waitFor } from "@testing-library/react";
import useProcessFile from "./useProcessFile";
import * as API from "../Data/index";

jest.mock("../api");
const processFileSpy = jest.spyOn(API, "process").mockImplementation(async () => {});

const mockData = {
    id: "12345678",
    watchType: WatchType.APPLE_WATCH,
};

describe("useProcessFile", () => {
    it("T5.08 should handle process successfully", async () => {
        const { result } = renderHook(useProcessFile);

        await result.current.handleProcess(mockData.id, mockData.watchType);

        expect(processFileSpy).toHaveBeenCalledTimes(1);
        expect(processFileSpy).toHaveBeenCalledWith(mockData.id, mockData.watchType);

        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(null);
        });
    });

    it("T5.09 should handle process when it errors", async () => {
        const { result } = renderHook(useProcessFile);

        processFileSpy.mockImplementation(async () => {
            throw new Error("Process failed");
        });
        await result.current.handleProcess(mockData.id, mockData.watchType);

        expect(processFileSpy).toHaveBeenCalledTimes(1);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual(
            "Processing applewatch file 12345678 error: Process failed",
        );
    });
});
