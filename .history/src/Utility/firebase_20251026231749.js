// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - THIS IS CORRECT!
const firebaseConfig = {
  apiKey: "AIzaSyDIaKmjfgCX6SkEd0TFeZOGprnN7zdjIiE",
  authDomain: "clone-ba7d6.firebaseapp.com",
  projectId: "clone-ba7d6",
  storageBucket: "clone-ba7d6.firebasestorage.app",
  messagingSenderId: "985807346475",
  appId: "1:985807346475:web:2012c895364981cde0036e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

console.log("✅ Firebase initialized successfully with project: clone-ba7d6");


export default app;
