
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi07Xbk5UVEzVTUSXpo8F8QYR-n1ZBYsQ",
  authDomain: "clone-c4ebb.firebaseapp.com",
  projectId: "clone-c4ebb",
  storageBucket: "clone-c4ebb.firebasestorage.app",
  messagingSenderId: "221170163939",
  appId: "1:221170163939:web:806d976f7a793f722f25d6"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();


