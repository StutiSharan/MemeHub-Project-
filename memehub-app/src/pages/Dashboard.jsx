import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref as dbRef,
  onValue,
  update,
  remove,
} from "firebase/database";
import { auth } from "../utils/firebaseConfig";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [memes, setMemes] = useState([]);
  const [editMeme, setEditMeme] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const memesRef = dbRef(db, `memes/${user.uid}`);
    onValue(memesRef, (snapshot) => {
      if (snapshot.exists()) {
        const memeList = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }));
        setMemes(memeList);
      } else {
        setMemes([]);
      }
    });
  }, []);
  //handle to upload memes
  const handleNavigateToUpload = () => {
    navigate("/upload");
  };

  const handleTogenerateMemes = () => {
    navigate("/generate");
  };
  const handleDelete = async (memeId) => {
    if (!auth.currentUser) return;

    try {
      await remove(dbRef(db, `memes/${auth.currentUser.uid}/${memeId}`));
      alert("Meme deleted successfully!");
    } catch (error) {
      console.error("Error deleting meme:", error);
    }
  };

  const handleEdit = (meme) => {
    setEditMeme(meme);
    setNewCaption(meme.caption);
  };

  const handleUpdate = async () => {
    if (!auth.currentUser || !editMeme) return;

    try {
      await update(dbRef(db, `memes/${auth.currentUser.uid}/${editMeme.id}`), {
        caption: newCaption,
      });

      setEditMeme(null);
      alert("Meme updated successfully!");
    } catch (error) {
      console.error("Error updating meme:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-4xl font-bold text-center text-indigo-600 mb-6">
        Welcome to Your Dashboard
      </h2>
      <p className="text-center text-gray-700">
        You have uploaded {memes.length} memes.
      </p>
      {/* the button that will rediects to the uplaod page */}
      <button
        onClick={handleNavigateToUpload}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
      >
        🚀 Upload Meme
      </button>
      <button
        onClick={handleTogenerateMemes}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
      >
        Generate Meme
      </button>
      {/* Meme Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="bg-white shadow-md rounded-lg p-4 relative"
          >
            <img
              src={meme.imageBase64}
              alt={meme.caption}
              className="w-full h-auto rounded-md object-cover"
            />
            <p className="text-center font-medium text-gray-800 mt-2">
              {meme.caption} 🤣🔥
            </p>

            {/* Show Edit & Delete buttons only for meme owner */}
            {auth.currentUser?.uid === meme.userId && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(meme)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(meme.id)}
                  className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Meme Popup */}
      {editMeme && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Meme Caption</h3>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleUpdate}
              className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded"
            >
              ✅ Update Meme
            </button>
            <button
              onClick={() => setEditMeme(null)}
              className="mt-2 w-full py-2 bg-gray-500 text-white font-semibold rounded"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
