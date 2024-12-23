// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcfZbAXOeWZWdUIESF_3ceZUEvXprnUjs",
  authDomain: "itd112lab3-cfce2.firebaseapp.com",
  projectId: "itd112lab3-cfce2",
  storageBucket: "itd112lab3-cfce2.firebasestorage.app",
  messagingSenderId: "33097405477",
  appId: "1:33097405477:web:946dc2a50ff9909cd25bcc",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
