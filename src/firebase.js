// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmQh89Bjt7_GO9FA8dwrELD8_t3DY9alg",
  authDomain: "academic-resource-hub-642a4.firebaseapp.com",
  projectId: "academic-resource-hub-642a4",
  storageBucket: "academic-resource-hub-642a4.appspot.com",
  messagingSenderId: "730326128364",
  appId: "1:730326128364:web:a935733d3195ffe80c77c9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
