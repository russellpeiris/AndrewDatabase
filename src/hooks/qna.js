import { addDoc, collection } from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

const qnaRef = collection(db, "qna");

const createQnA = async (qnaValues, imageUrls) => {
    await addDoc(qnaRef, {
        question: qnaValues.question || "",
        answer: qnaValues.answer || "",
        category: qnaValues.category || "",
        username: qnaValues.username || "",
        images: imageUrls || [],
      })
}

export { createQnA };
