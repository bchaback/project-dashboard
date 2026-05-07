// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVT6AeBNsYECYQS8vOLshA7ZRrmBLRvWs",
  authDomain: "project-dashboard-54d6e.firebaseapp.com",
  projectId: "project-dashboard-54d6e",
  storageBucket: "project-dashboard-54d6e.firebasestorage.app",
  messagingSenderId: "1093016248627",
  appId: "1:1093016248627:web:1265c26d04aa3a51b1de46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);