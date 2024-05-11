import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbWFKIK0AZh2EkIWOlQcki9P6YuQOEUOI",
  authDomain: "question-and-answer-database.firebaseapp.com",
  projectId: "question-and-answer-database",
  storageBucket: "question-and-answer-database.appspot.com",
  messagingSenderId: "327449683693",
  appId: "1:327449683693:web:592e256bafcd898d4c8ee4",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
