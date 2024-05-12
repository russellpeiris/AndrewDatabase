import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../configs/firebaseConfig";

const uploadImages = async (fileList) => {
    const imageUrls = [];
    for (const file of fileList) {
      const storageRef = ref(storage, `images/${file.uid}`);

      try {
        const uploadTask = await uploadBytes(storageRef, file.originFileObj);
        const imageUrl = await getDownloadURL(uploadTask.ref);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return imageUrls;
  };

    export { uploadImages };

