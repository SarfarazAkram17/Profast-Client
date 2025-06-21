// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_UrjM-CqDMLyEmOG9GqXlMfVdqizOYPU",
  authDomain: "profast-7d320.firebaseapp.com",
  projectId: "profast-7d320",
  storageBucket: "profast-7d320.firebasestorage.app",
  messagingSenderId: "770210072613",
  appId: "1:770210072613:web:0c65763e539d3873e357cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)