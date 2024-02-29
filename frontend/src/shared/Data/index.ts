import api from "shared/api/baseapi";
import {
  WatchType,
  ProcessedFilesData,
  PredictedFilesData,
  RawFilesData,
  DownloadData,
  PredictionType,
} from "shared/api";

/**
 * Uploads a file
 * @param form the data to upload
 * @param year the year the file was created
 * @param watchType the type of watch being uploaded. Either "fitbit" or "applewatch"
 * @returns
 */
export async function upload(
  form: FormData,
  year: string,
  watchType: WatchType,
): Promise<void> {
  await api.post(`/rest/beapengine/${watchType}/upload`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Processes a file
 * @param id a string id corresponding to a file
 * @param watchType the type of watch to be processed
 */
export async function process(id: any, watchType: WatchType): Promise<void> {
  await api.get(`/rest/beapengine//${watchType}/process/${id}`);
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
  await api.get(`/rest/beapengine//${watchType}/predict/${id}/${model}`);
}

/**
 * Downloads a file
 * @param id a string id corresponding to a file
 * @param type the type of download
 * @param watchType the type of watch being predicted
 * @returns
 */
export async function download(
  id: string,
  type: string,
  watchType: WatchType,
): Promise<DownloadData> {
  const response = await api.get(
    `/rest/beapengine//${watchType}/download_file/${id}/${type}`,
  );
  return { file: response.data.file };
}

/**
 * Deletes a file from the back-end
 * @param id a string id corresponding to a file
 * @param watchType the type of watch being predicted
 */
export const deleteFile = async (
  id: string,
  watchType: WatchType,
): Promise<void> => {
  await api.get(`/rest/beapengine/${watchType}/delete/${id}`);
};

/**
 * gets a list of uploaded files
 * @param watchType the type of watch being predicted
 * @returns the list of uploaded files
 */
export async function getUploadedFiles(
  watchType: WatchType,
): Promise<RawFilesData> {
  const response = await api.get(`/rest/beapengine/${watchType}/list/raw`);
  return { list: response.data.list };
}

/**
 * gets the list of predicted files
 * @param watchType the type of watch being predicted
 * @returns the list of predicted files
 */
export async function getPredictedDataList(
  watchType: WatchType,
): Promise<PredictedFilesData> {
  const response = await api.get(
    `/rest/beapengine/${watchType}/list/predicted`,
  );
  return { list: response.data.list };
}

/**
 * gets a list of processed files
 * @param watchType the type of watch being predicted
 * @returns a list of files
 */
export async function getProcessedDataList(
  watchType: WatchType,
): Promise<ProcessedFilesData> {
  const response = await api.get(
    `/rest/beapengine/${watchType}/list/processed`,
  );
  return { list: response.data.list };
}
