// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAosF3NXrt-K3sjIttdS_vyOjGQ6-0w4CM",
  authDomain: "mcqauth-34ac5.firebaseapp.com",
  projectId: "mcqauth-34ac5",
  storageBucket: "mcqauth-34ac5.firebasestorage.app",
  messagingSenderId: "663801993943",
  appId: "1:663801993943:web:7431543aaf72b906d3ee92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app); // <-- pass app here!
export default app;