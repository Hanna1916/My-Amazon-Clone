import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ CORRECT Firebase configuration for your actual project
const firebaseConfig = {
  apiKey: "AIzaSyDIaKmjfgCX6SkEd0TFeZOGprnN7zdjIiE", // Your actual API key
  authDomain: "clone-ba7d6.firebaseapp.com", // Should be clone-ba7d6.firebaseapp.com
  projectId: "clone-ba7d6", // Your actual project ID
  storageBucket: "clone-ba7d6.firebasestorage.app", // Should match your project
  messagingSenderId: "985807346475", // Your actual sender ID
  appId: "1:985807346475:web:xxxxxxxxxxxxxx", // You'll need to get this
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

console.log("✅ Firebase initialized with project:", firebaseConfig.projectId);

export default app;
