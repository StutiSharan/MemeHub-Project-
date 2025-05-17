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
import Loading from "../components/Loader";

const Dashboard = () => {
  const [memes, setMemes] = useState([]);
  const [editMeme, setEditMeme] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const memesRef = dbRef(db, `memes/${user.uid}`);
    setLoading(true);
    onValue(memesRef, (snapshot) => {
      if (snapshot.exists()) {
        const memesData = snapshot.val();

        const memeList = Object.entries(memesData).map(([id, data]) => {
          const votesCount = data.votes ? Object.keys(data.votes).length : 0;
          const commentsCount = data.comments ? Object.keys(data.comments).length : 0;

          return {
            id,
            ...data,
            votes: votesCount,
            comments: commentsCount,
            userId: data.userId || user.uid,
          };
        });

        // No sorting here anymore

        setMemes(memeList);
      } else {
        setMemes([]);
      }
      setLoading(false);
    });
  }, [db]);

  const handleNavigateToUpload = () => navigate("/upload");
  const handleTogenerateMemes = () => navigate("/generate");

  const handleDelete = async (memeId) => {
    if (!auth.currentUser) return;
    try {
      await remove(dbRef(db, `memes/${auth.currentUser.uid}/${memeId}`));
      setPopupMessage("🗑️ Meme deleted successfully!");
      setTimeout(() => setPopupMessage(""), 2000);
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
      setPopupMessage("✏️ Meme updated successfully!");
      setTimeout(() => setPopupMessage(""), 2000);
    } catch (error) {
      console.error("Error updating meme:", error);
    }
  };

  return loading ? (
    <Loading />
  ) : (
   <div className="space-y-10 px-4 sm:px-6 lg:px-16 py-6 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 min-h-screen text-white select-none">      {/* Tabs */}
      <h2 className="text-5xl font-extrabold text-center text-indigo-200 drop-shadow mb-4">
        Welcome to Your Dashboard
      </h2>
      <p className="text-center text-lg text-white-700 mb-6">
        🎉 You've uploaded <strong>{memes.length}</strong> memes so far!
      </p>

      {popupMessage && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          {popupMessage}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={handleNavigateToUpload}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md transform hover:scale-105 transition"
        >
          🚀 Upload Meme
        </button>
        <button
          onClick={handleTogenerateMemes}
          className="bg-pink-500 hover:bg-pink-400 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md transform hover:scale-105 transition"
        >
          🎨 Generate Meme
        </button>
      </div>

      {/* Removed Sort dropdown */}

      {/* Meme Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="bg-white shadow-xl hover:shadow-2xl rounded-xl p-4 relative transition-transform transform hover:scale-105"
          >
            <img
              src={meme.imageBase64}
              alt={meme.caption}
              className="w-full h-auto rounded-md object-cover"
            />
            <p className="text-center font-semibold text-gray-800 mt-3 text-lg">
              {meme.caption}
            </p>

           
            {/* Optional: Creation date */}
            {meme.createdAt && (
              <p className="text-xs text-center text-gray-500 mt-1">
                📅 {new Date(meme.createdAt).toLocaleDateString()}
              </p>
            )}

            {/* Edit/Delete buttons */}
            {auth.currentUser?.uid === meme.userId && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(meme)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md text-sm shadow-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(meme.id)}
                  className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md text-sm shadow-sm"
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Meme Modal */}
      {editMeme && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">
              ✏️ Edit Meme Caption
            </h3>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleUpdate}
              className="mt-4 w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition"
            >
              ✅ Update Meme
            </button>
            <button
              onClick={() => setEditMeme(null)}
              className="mt-2 w-full py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition"
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
