import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import { WatchType, DownloadType } from "shared/api";
import useDownload from "./useDownload";
import * as API from "../Data/index";

const mockSetStorage = jest.fn();

jest.mock("../api");
jest.mock("usehooks-ts", () => ({
    useLocalStorage: () => ["", mockSetStorage],
}));

const mockData = {
    id: "1234",
    type: DownloadType.PROCESS,
    watchType: WatchType.APPLE_WATCH,
};

const byteData: Uint8Array = new Uint8Array(10);

const mockReturnData = {
    file: byteData,
};

const downloadFileSpy = jest.spyOn(API, "download").mockImplementation(async () => mockReturnData);

describe("useDownload", () => {

    it("T4.3 should download a file from the database", async () => {

        const { result } = renderHook(useDownload);
        await result.current.handleDownload(mockData.id, mockData.type, mockData.watchType);

        expect(downloadFileSpy).toHaveBeenCalledTimes(1);
        expect(downloadFileSpy).toHaveBeenCalledWith(
            mockData.id,
            mockData.type,
            mockData.watchType,
        );

        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isDownloading).toBe(false);
            expect(result.current.error).toBe(null);
        });
    });


    it("T4.4 should handle download when it errors", async () => {

        const { result } = renderHook(useDownload);
        await result.current.handleDownload(mockData.id, mockData.type, mockData.watchType);

        downloadFileSpy.mockImplementation(async () => {
            throw new Error("Download Failed");
        });

        expect(downloadFileSpy).toHaveBeenCalledTimes(1);
        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isDownloading).toBe(false);
            expect(result.current.error).toEqual(
                "An error has occured while downloading a file: Download Failed",
            );
        });
    });
});
