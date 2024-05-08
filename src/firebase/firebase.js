import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from "../configs/firebaseConfig";

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

export { db, storage };
