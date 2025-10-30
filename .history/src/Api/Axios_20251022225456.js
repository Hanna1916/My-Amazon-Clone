// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

import axios from "axios";

// For Firebase Functions (replace with your actual function URL after deployment)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001/clone-ba7d6/us-central1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});