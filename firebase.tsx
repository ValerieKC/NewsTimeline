// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjlJm3QYMf3H4MXbaUtYTWJwJ-AdTbs68",
  authDomain: "newstimeline-d713e.firebaseapp.com",
  projectId: "newstimeline-d713e",
  storageBucket: "newstimeline-d713e.appspot.com",
  messagingSenderId: "763973889422",
  appId: "1:763973889422:web:fa485836f0a06ea7ba88df",
  measurementId: "G-FF6XFY4H8J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
