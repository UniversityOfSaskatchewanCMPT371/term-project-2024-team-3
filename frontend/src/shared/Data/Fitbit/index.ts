import axios, { AxiosPromise } from "axios";

const DEV =
  "http://138.197.134.112:8080/BeaplabEngine-0.0.1-SNAPSHOT/rest/beapengine/fitbit";
// const PROD = "/api/rest/beapengine/fitbit";

const $axios = axios.create({
  baseURL: DEV,
  withCredentials: true,
  responseType: "json",
});

export default class FitbitService {
  // constructor() {}

  upload(form: FormData, year: string): AxiosPromise {
    return $axios.post(`/upload/${year}`, form, {
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

  download(id: string, type: string): AxiosPromise {
    return $axios.get(`/download_file/${id}/${type}`);
  }

  delete(id: string): AxiosPromise {
    return $axios.get(`/delete/${id}`);
  }

  getUploadedFiles(): AxiosPromise {
    return $axios.get("/list/raw");
  }

  getPredictedDataList(): AxiosPromise {
    return $axios.get("/list/predicted");
  }

  getProcessedDataList(): AxiosPromise {
    return $axios.get("/list/processed");
  }
}
