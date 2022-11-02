// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASECONFIG_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASECONFIG_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASECONFIG_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASECONFIG_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASECONFIG_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASECONFIG_APPID,
  measurementId: process.env.REACT_APP_FIREBASECONFIG_MEASUREMENTID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app)

export {db}