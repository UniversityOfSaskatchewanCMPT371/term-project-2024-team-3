import { AxiosPromise } from "axios";
import api from "shared/api/baseapi";

export default class WatchService {
  upload(form: FormData, year: string, watchType: string): AxiosPromise {
    return api.post(`/${watchType}/upload/${year}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  process(id: any, watchType: string): AxiosPromise {
    return api.get(`/${watchType}/process/${id}`);
  }

  predict(id: string, model: string, watchType: string): AxiosPromise {
    return api.get(`/${watchType}/predict/${id}/${model}`);
  }

  download(id: string, type: string, watchType: string): AxiosPromise {
    return api.get(`/${watchType}/download_file/${id}/${type}`);
  }

  delete(id: string, watchType: string): AxiosPromise {
    return api.get(`/${watchType}/delete/${id}`);
  }

  getUploadedFiles(watchType: string): AxiosPromise {
    return api.get(`/${watchType}/list/raw`);
  }

  getPredictedDataList(watchType: string): AxiosPromise {
    return api.get(`/${watchType}/list/predicted`);
  }

  getProcessedDataList(watchType: string): AxiosPromise {
    return api.get(`/${watchType}/list/processed`);
  }
}
