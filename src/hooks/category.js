import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

const categoryRef = collection(db, "categories");
// const category = {
//   parentCategory: "",
//   subCategories: [],
// }
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
  //get the document id
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

export { createCategory, getCategories, updateChildCategory };
