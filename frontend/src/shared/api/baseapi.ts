import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://beapengine.com/api"
      : "http://localhost:8080",

  withCredentials: true,
  responseType: "json",
});
export default api;
