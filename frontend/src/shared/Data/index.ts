import api from "shared/api/baseapi";
import {
    WatchType,
    ProcessedFilesData,
    PredictedFilesData,
    RawFilesData,
    DownloadData,
    PredictionType,
    DownloadType,
} from "shared/api";
import axios from "axios";

/**
 * Uploads a file
 * @param form the data to upload
 * @param year the year the file was created
 * @param watchType the type of watch being uploaded. Either "fitbit" or "applewatch"
 * @returns
 */
export async function upload(form: FormData, year: string, watchType: WatchType): Promise<void> {
    try {
        await api.post(`/rest/beapengine/${watchType}/upload`, form, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Upload Failed");
    }
}

/**
 * Processes a file
 * @param id a string id corresponding to a file
 * @param watchType the type of watch to be processed
 */
export async function process(id: any, watchType: WatchType): Promise<void> {
    try {
        await api.get(`/rest/beapengine/${watchType}/process/${id}`);
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Process File Failed");
    }
}

/**
 * sends a file to the R repository for predicting
 * @param id a string id corresponding to a file
 * @param model the model
 * @param watchType the type of watch being predicted
 */
export async function predict(
    id: string,
    model: PredictionType,
    watchType: WatchType,
): Promise<void> {
    try {
        await api.get(`/rest/beapengine/${watchType}/predict/${id}/${model}`);
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Predict File Failed");
    }
}

/**
 * Downloads a file
 * @param id a string id corresponding to a file
 * @param type the type of download, either process or download
 * @param watchType the type of watch being predicted
 * @returns
 */
export async function download(
    id: string,
    type: DownloadType,
    watchType: WatchType,
): Promise<DownloadData> {
    try {
        const response = await api.get(`/rest/beapengine/${watchType}/download_file/${id}/${type}`);
        return { file: response.data?.file };
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Download File Failed");
    }
}

/**
 * Deletes a file from the back-end
 * @param id a string id corresponding to a file
 * @param watchType the type of watch being predicted
 */
export const deleteFile = async (id: string, watchType: WatchType): Promise<void> => {
    try {
        await api.get(`/rest/beapengine/${watchType}/delete/${id}`);
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Delete File Failed");
    }
};

/**
 * gets a list of uploaded files
 * @param watchType the type of watch being predicted
 * @returns the list of uploaded files
 */
export async function getUploadedFiles(watchType: WatchType): Promise<RawFilesData> {
    try {
        const response = await api.get(`/rest/beapengine/${watchType}/list/raw`);
        return { list: response.data.list ?? [] };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data.message === "Raw data not found") {
            return { list: [] };
        }
        throw new Error(error.response?.data?.message ?? "Getting Uploaded Files Failed");
    }
}

/**
 * gets the list of predicted files
 * @param watchType the type of watch being predicted
 * @returns the list of predicted files
 */
export async function getPredictedDataList(watchType: WatchType): Promise<PredictedFilesData> {
    try {
        const response = await api.get(`/rest/beapengine/${watchType}/list/predicted`);
        return { list: response.data.list ?? [] };
    } catch (error) {
        if (
            axios.isAxiosError(error) &&
            error.response?.data.message === "Predicted data not found"
        ) {
            return { list: [] };
        }
        throw new Error(error.response?.data?.message ?? "Getting Predicted Files Failed");
    }
}

/**
 * gets a list of processed files
 * @param watchType the type of watch being predicted
 * @returns a list of files
 */
export async function getProcessedDataList(watchType: WatchType): Promise<ProcessedFilesData> {
    try {
        const response = await api.get(`/rest/beapengine/${watchType}/list/processed`);
        return { list: response.data.list ?? [] };
    } catch (error) {
        if (
            axios.isAxiosError(error) &&
            error.response?.data.message === "Processed data not found"
        ) {
            return { list: [] };
        }
        throw new Error(error.response?.data?.message ?? "Getting Processed Files Failed");
    }
}
