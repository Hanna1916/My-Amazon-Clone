import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001/clone-c4ebb/us-central1/api"
});

export default axiosInstance;
