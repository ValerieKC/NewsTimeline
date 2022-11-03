// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwG0RchLnm1vyJk1sduJRgZiZ7m6wUdoI",
  authDomain: "newstimeline-b3920.firebaseapp.com",
  projectId: "newstimeline-b3920",
  storageBucket: "newstimeline-b3920.appspot.com",
  messagingSenderId: "859858065657",
  appId: "1:859858065657:web:277547d45bc0e3f598aa28",
  measurementId: "G-D5357ZCE99",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app)

export {db}