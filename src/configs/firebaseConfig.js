import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7GSiKCDW5JeQ6ltErkhNOeVMt_VQwSQ4",
  authDomain: "andrew-database-f2700.firebaseapp.com",
  projectId: "andrew-database-f2700",
  storageBucket: "andrew-database-f2700.firebasestorage.app",
  messagingSenderId: "699422212251",
  appId: "1:699422212251:web:5b2280661e9b0cf52c863e",
  measurementId: "G-XFJYZ0QKDH"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
