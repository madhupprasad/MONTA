import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebase-config.json" assert { type: "json" };

// Your web app's Firebase configuration
// get from firebase-config.json without using require

// Initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const auth = getAuth(getApp());

export { auth };
