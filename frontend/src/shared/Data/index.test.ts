import { WatchType, PredictionType, DownloadType } from "shared/api";
import api from "shared/api/baseapi";
import {
    deleteFile,
    download,
    getPredictedDataList,
    getProcessedDataList,
    getUploadedFiles,
    predict,
    process,
    upload,
} from "./index";

describe("Data API Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("T4.38 Upload: should upload a file", async () => {
        jest.spyOn(api, "post").mockResolvedValueOnce({
            ok: true,
        });

        const formData = new FormData();
        formData.append("file", "some buffer");

        await upload(formData, "2024", WatchType.FITBIT);

        expect(api.post).toHaveBeenCalledWith("/rest/beapengine/fitbit/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    });

    it("T4.39 Process: should process a file", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            ok: true,
        });

        await process(1, WatchType.APPLE_WATCH);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/applewatch/process/1");
    });

    it("T4.40 Predict: should predict a file", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            ok: true,
        });

        await predict("1", PredictionType.RANDOM_FOREST, WatchType.APPLE_WATCH);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/applewatch/predict/1/randomForest");
    });

    it("T4.41 Download: should download a file", async () => {
        const file = new Uint8Array(new ArrayBuffer(8));
        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: {
                file,
            },
        });

        const result = await download("1", DownloadType.PREDICT, WatchType.APPLE_WATCH);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/applewatch/download_file/1/predict");
        expect(result.file).toEqual(file);
    });

    it("T4.42 Download: should download a undefined file", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: undefined,
        });

        const result = await download("1", DownloadType.PREDICT, WatchType.APPLE_WATCH);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/applewatch/download_file/1/predict");
        expect(result.file).toBeUndefined();
    });

    it("T4.43 Delete: should delete a file", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({});

        await deleteFile("1", WatchType.FITBIT);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/fitbit/delete/1");
    });

    it("T4.44 GetUploadedFiles: get if file exist", async () => {
        const files = { list: [] };

        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: {
                list: files,
            },
        });

        const result = await getUploadedFiles(WatchType.FITBIT);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/fitbit/list/raw");
        expect(result.list).toBe(files);
    });

    it("T4.45 GetUploadedFiles: get if file does not exist", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: {},
        });

        const result = await getUploadedFiles(WatchType.FITBIT);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/fitbit/list/raw");
        expect(result.list.length).toBe(0);
    });

    it("T4.46 GetPredictedDataList: get if file exist", async () => {
        const files = { list: [] };

        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: {
                list: files,
            },
        });

        const result = await getPredictedDataList(WatchType.FITBIT);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/fitbit/list/predicted");
        expect(result.list).toBe(files);
    });

    it("T4.47 GetPredictedDataList: get if file does not exist", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: {},
        });

        const result = await getPredictedDataList(WatchType.FITBIT);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/fitbit/list/predicted");
        expect(result.list.length).toBe(0);
    });

    it("T4.48 GetProcessedDataList: get if file exist", async () => {
        const files = { list: [] };

        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: {
                list: files,
            },
        });

        const result = await getProcessedDataList(WatchType.FITBIT);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/fitbit/list/processed");
        expect(result.list).toBe(files);
    });

    it("T4.49 GetProcessedDataList: get if file does not exist", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: {},
        });

        const result = await getProcessedDataList(WatchType.FITBIT);

        expect(api.get).toHaveBeenCalledWith("/rest/beapengine/fitbit/list/processed");
        expect(result.list.length).toBe(0);
    });
});
