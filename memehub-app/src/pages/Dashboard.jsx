import React, { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../utils/firebaseConfig";
import UploadMeme from "../components/UploadMems";

const Dashboard = () => {
  const [memes, setMemes] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "memes"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const memeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemes(memeList);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleDelete = async (memeId) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, "memes", memeId));
      alert("Meme deleted successfully!");
    } catch (error) {
      console.error("Error deleting meme:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to Your Dashboard</h2>
      <p>You have uploaded {memes.length} memes.</p>
      <div className="grid grid-cols-2 gap-4">
        {memes.map((meme) => (
          <div key={meme.id} className="border p-4 rounded-lg">
            <img
              src={meme.imageUrl}
              alt={meme.caption}
              className="w-full h-auto rounded"
            />
            <p className="text-center mt-2">{meme.caption}</p>

            {/* Show delete button only for logged-in user's own memes */}
            {auth.currentUser?.uid === meme.userId && (
              <button
                onClick={() => handleDelete(meme.id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <UploadMeme />
    </div>
  );
};

export default Dashboard;
