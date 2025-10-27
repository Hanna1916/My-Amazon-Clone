// Use your actual Render backend URL
const RENDER_BACKEND_URL = "https://amazon-clone-backend.onrender.com"; // ← Your actual URL here
const LOCAL_BACKEND_URL = "http://localhost:3001";

const BASE_URL = import.meta.env.PROD ? RENDER_BACKEND_URL : LOCAL_BACKEND_URL;

console.log(`🌐 Using backend: ${BASE_URL}`);

export const axiosInstance = {
  post: async (url, data) => {
    const fullUrl = `${BASE_URL}${url}`;

    console.log(`🔄 Making API request to: ${fullUrl}`);

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },
};
