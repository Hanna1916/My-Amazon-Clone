import axios from "axios";

// For local Firebase emulator
const BASE_URL = "http://127.0.0.1:5001/clone-ba7d6/us-central1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
