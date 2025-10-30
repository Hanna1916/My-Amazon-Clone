// src/Utility/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration - MAKE SURE THESE ARE CORRECT
const firebaseConfig = {
  apiKey: "AIzaSyDi07Xbk5UVEzVTUSXpo8F8QYR-n1ZBYsQ",
  authDomain: "clone-c4ebb.firebaseapp.com",
  projectId: "clone-c4ebb",
  storageBucket: "clone-c4ebb.firebasestorage.app",
  messagingSenderId: "221170163939",
  appId: "1:221170163939:web:806d976f7a793f722f25d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// ✅ Initialize Firestore and export it
export const db = getFirestore(app);

export default app;
