// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4NJWmey2Lx6ugze3sPq6fzas0cDFQMQQ",
  authDomain: "bottles-up-2d907.firebaseapp.com",
  projectId: "bottles-up-2d907",
  storageBucket: "bottles-up-2d907.firebasestorage.app",
  messagingSenderId: "49598092873",
  appId: "1:49598092873:web:e0bafc71042b1adf219198",
  measurementId: "G-92ECHPJ37E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };
export default app; 