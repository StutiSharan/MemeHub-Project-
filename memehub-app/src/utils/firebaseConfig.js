import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getDatabase} from "firebase/database"
const firebaseConfig = {
  apiKey: "AIzaSyDRCGFXgTsPaJhlNp7mFwDENBLZRFlb9Ik",
  authDomain: "memehub-c5222.firebaseapp.com",
  projectId: "memehub-c5222",
  storageBucket: "memehub-c5222.firebasestorage.app",
  messagingSenderId: "529198069257",
  appId: "1:529198069257:web:876c0d839639d078056ad8",
  measurementId: "G-ZBN7V3NE0M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
export { auth, analytics, logEvent,database };
