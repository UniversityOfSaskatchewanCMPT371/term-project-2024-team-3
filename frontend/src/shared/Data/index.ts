import api from "shared/api/baseapi";
import {
  WatchType,
  ProcessedFilesData,
  PredictedFilesData,
  RawFilesData,
  DownloadData,
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
  await api.post(`/${watchType}/upload/${year}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function process(id: any, watchType: WatchType): Promise<void> {
  await api.get(`/${watchType}/process/${id}`);
}

export async function predict(
  id: string,
  model: string,
  watchType: WatchType,
): Promise<void> {
  await api.get(`/${watchType}/predict/${id}/${model}`);
}

export async function download(
  id: string,
  type: string,
  watchType: WatchType,
): Promise<DownloadData> {
  const response = await api.get(`/${watchType}/download_file/${id}/${type}`);
  return { file: response.data.file };
}

export const deleteFile = async (
  id: string,
  watchType: WatchType,
): Promise<void> => {
  await api.get(`/${watchType}/delete/${id}`);
};

export async function getUploadedFiles(
  watchType: WatchType,
): Promise<RawFilesData> {
  const response = await api.get(`/${watchType}/list/raw`);
  return { list: response.data.list };
}

export async function getPredictedDataList(
  watchType: WatchType,
): Promise<PredictedFilesData> {
  const response = await api.get(`/${watchType}/list/predicted`);
  return { list: response.data.list };
}

export async function getProcessedDataList(
  watchType: WatchType,
): Promise<ProcessedFilesData> {
  const response = await api.get(`/${watchType}/list/processed`);
  return { list: response.data.list };
}
