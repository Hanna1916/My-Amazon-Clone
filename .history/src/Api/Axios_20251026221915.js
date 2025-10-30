// // import axios from "axios";

// // // For local Firebase emulator
// // const BASE_URL = "http://127.0.0.1:5001/clone-ba7d6/us-central1";

// // export const axiosInstance = axios.create({
// //   baseURL: BASE_URL,
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // Backend URLs
// const RENDER_BACKEND_URL = "https://ammazon-clone-project-2025-2.onrender.com";
// const LOCAL_BACKEND_URL = "http://localhost:3001";

// // Use Render for production, local for development
// const BASE_URL = import.meta.env.PROD ? RENDER_BACKEND_URL : LOCAL_BACKEND_URL;

// console.log(`🌐 Using backend: ${BASE_URL}`);

// export const axiosInstance = {
//   post: async (url, data) => {
//     const fullUrl = `${BASE_URL}${url}`;

//     console.log(`🔄 API Request: ${fullUrl}`, data);

//     try {
//       const response = await fetch(fullUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.error || `HTTP error! status: ${response.status}`
//         );
//       }

//       console.log(`✅ API Response: ${url}`, result);
//       return result;
//     } catch (error) {
//       console.error(`❌ API Error: ${url}`, error);
//       throw error;
//     }
//   },

//   get: async (url) => {
//     const fullUrl = `${BASE_URL}${url}`;

//     try {
//       const response = await fetch(fullUrl);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("API request failed:", error);
//       throw error;
//     }
//   },
// };
