import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
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
  await addDoc(categoryRef, { category: category, children: []});
};

const updateChildCategory = async (category, children) => {
  //get the document id
  const querySnapshot = await getDocs(categoryRef);
  let categoryId = "";
  querySnapshot.forEach((doc) => {
    if (doc.data().category === category) {
      categoryId = doc.id;
    }
  });
  const categoryDoc = doc(categoryRef, categoryId);
  await setDoc(categoryDoc, { category: category, children: children });
}

export { createCategory, getCategories, updateChildCategory };
