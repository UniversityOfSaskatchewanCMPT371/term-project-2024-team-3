import axios, { AxiosPromise } from "axios";

const DEV =
  "http://138.197.134.112:8080/BeaplabEngine-0.0.1-SNAPSHOT/rest/beapengine/applewatch";
// const PROD = "/api/rest/beapengine/applewatch";

const $axios = axios.create({
  baseURL: DEV,
  withCredentials: true,
  responseType: "json",
});

export default class AppleWatchService {
  // constructor() {}

  upload(form: FormData): AxiosPromise {
    return $axios.post("/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  process(id: any): AxiosPromise {
    return $axios.get(`/process/${id}`);
  }

  predict(id: string, model: string): AxiosPromise {
    return $axios.get(`/predict/${id}/${model}`);
  }

  delete(id: string): AxiosPromise {
    return $axios.get(`/delete/${id}`);
  }

  download(id: string, type: string): AxiosPromise {
    return $axios.get(`/download_file/${id}/${type}`);
  }

  getUploadedFiles(): AxiosPromise {
    return $axios.get("/list/raw", { withCredentials: true });
  }

  getPredictedDataList(): AxiosPromise {
    return $axios.get("/list/predicted");
  }

  getProcessedDataList(): AxiosPromise {
    return $axios.get("/list/processed");
  }
}
