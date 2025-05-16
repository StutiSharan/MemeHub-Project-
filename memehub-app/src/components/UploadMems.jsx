import React, { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";

const UploadMeme = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image || !user) {
      setError("Please select an image");
      return;
    }

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `memes/${user.uid}/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // Store in Firestore
      await addDoc(collection(db, "memes"), {
        userId: user.uid,
        imageUrl,
        caption,
        timestamp: Timestamp.now(),
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-gray-900">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Upload a Meme</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <input
            type="text"
            placeholder="Enter meme caption"
            className="w-full p-2 border rounded"
            onChange={(e) => setCaption(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded"
          >
            Upload Meme
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMeme;
