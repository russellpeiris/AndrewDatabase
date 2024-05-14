import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

const categoryRef = collection(db, "categories");

const getCategories = async () => {
  const querySnapshot = await getDocs(categoryRef);
  let categories = [];
  querySnapshot.forEach((doc) => {
    categories.push(doc.data());
  });
  return categories;
};

const createCategory = async (category) => {
  await addDoc(categoryRef, { parentCategory: category, subCategories: [] });
};

const updateChildCategory = async (parentCategory, subCategories) => {
  const querySnapshot = await getDocs(categoryRef);
  let categoryId = "";
  querySnapshot.forEach((doc) => {
    if (doc.data().parentCategory === parentCategory) {
      categoryId = doc.id;
    }
  });
  const categoryDoc = doc(categoryRef, categoryId);
  await setDoc(categoryDoc, { parentCategory, subCategories });
};

const deleteCategory = async (category) => {
  const querySnapshot = await getDocs(categoryRef);
  let categoryId = "";
  querySnapshot.forEach((doc) => {
    if (doc.data().parentCategory === category) {
      categoryId = doc.id;
    }
  });
  const categoryDoc = doc(categoryRef, categoryId);
  await deleteDoc(categoryDoc);
};

export { createCategory, getCategories, updateChildCategory, deleteCategory };
