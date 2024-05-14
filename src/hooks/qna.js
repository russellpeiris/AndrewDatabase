import { message } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

const qnaRef = collection(db, "qna");

const createQnA = async (qnaValues, imageUrls) => {
  await addDoc(qnaRef, {
    question: qnaValues.question || "",
    answer: qnaValues.answer || "",
    parentCategory: qnaValues.parentCategory || "",
    subCategories:
      qnaValues.subCategory === "None" ? "" : qnaValues.subCategory || "",
    username: qnaValues.username || "",
    images: imageUrls || [],
    createdAt: new Date(),
  });
};

const getAllQnA = async () => {
  const qna = [];
  const q = query(qnaRef, orderBy("createdAt", "desc"));
  const qnaSnapshot = await getDocs(q);

  if (qnaSnapshot.empty) {
    return qna;
  }

  qnaSnapshot.forEach((doc) => {
    const qnaData = doc.data();
    qna.push({
      id: doc.id,
      question: qnaData.question,
      answer: qnaData.answer,
      parentCategory: qnaData.parentCategory,
      subCategory: qnaData.subCategory,
      username: qnaData.username,
      images: qnaData.images,
    });
  });

  return qna;
};

const getQnAById = async (id) => {
  const docRef = doc(qnaRef, id);
  const docSnap = await getDoc(docRef);

  if (docSnap) {
    return docSnap.data();
  } else {
    message.warning("No such document!");
  }
};

const deleteQnA = async (id) => {
  await deleteDoc(doc(qnaRef, id));
};

const updateQnA = async (id, qnaValues, imageUrls) => {
  const docRef = doc(qnaRef, id);
  await setDoc(docRef, {
    question: qnaValues.question || "",
    answer: qnaValues.answer || "",
    parentCategory: qnaValues.parentCategory || "",
    subCategory: qnaValues.subCategory || "",
    username: qnaValues.username || "",
    images: imageUrls || [],
    createdAt: new Date(),
  });
};
export { createQnA, deleteQnA, getAllQnA, getQnAById, updateQnA };
