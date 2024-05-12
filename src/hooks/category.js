import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

const categoryRef = collection(db, "categories");

const getCategories = async () => {
  const categories = [];
  const categorySnapshot = await getDocs(categoryRef);

  if (categorySnapshot.empty) {
    return categories;
  }

  categorySnapshot.forEach((doc) => {
    const categoryData = doc.data();
    categories.push({
      label: categoryData.category,
      value: categoryData.category,
    });
  });

  return categories;
};

const createCategory = async (categoryValues) => {
    await addDoc(categoryRef, { category: categoryValues.category });
}


export { createCategory, getCategories };




