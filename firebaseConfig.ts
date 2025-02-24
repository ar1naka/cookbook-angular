// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, Database, get } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "*",
  authDomain: "project.firebaseapp.com",
  projectId: "project",
  storageBucket: "project.firebasestorage.app",
  messagingSenderId: "*",
  appId: "*",
  measurementId: "*"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const app = initializeApp(firebaseConfig);
const db: Database = getDatabase(app); 

export { db, ref, set, push, get };
