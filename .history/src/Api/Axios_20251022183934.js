// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:5001/clone-c4ebb/us-central1/api"
// });

// export default axiosInstance;
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);