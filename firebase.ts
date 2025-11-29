// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe1aCYYnzzwixTCNlkkMX-wldArVxiUvw",
  authDomain: "wedding-heart.firebaseapp.com",
  projectId: "wedding-heart",
  storageBucket: "wedding-heart.firebasestorage.app",
  messagingSenderId: "316269849466",
  appId: "1:316269849466:web:78bc06316a46c2bc32c4c3",
  measurementId: "G-6W2BRYHFWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);