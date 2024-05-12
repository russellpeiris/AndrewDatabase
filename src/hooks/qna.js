import { addDoc, collection, getDocs } from "firebase/firestore";
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

const getQnA = async () => {
    const qna = [];
    const qnaSnapshot = await getDocs(qnaRef);

    if (qnaSnapshot.empty) {
        return qna;
    }

    qnaSnapshot.forEach((doc) => {
        const qnaData = doc.data();
        qna.push({
            id: doc.id,
            question: qnaData.question,
            answer: qnaData.answer,
            category: qnaData.category,
            username: qnaData.username,
            images: qnaData.images,
        });
    });

    return qna;
};
export { createQnA, getQnA };
