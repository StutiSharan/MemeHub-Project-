import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getDatabase();
const auth = getAuth();
const firestore = getFirestore();

const AdminDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [memes, setMemes] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch user role to ensure admin-only access
  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        setUserRole("admin");
        fetchMemes();
      } else {
        navigate("/");
      }
    };

    checkRole();
  }, []);

  // ✅ Fetch memes dynamically from Firebase Realtime Database
  const fetchMemes = () => {
    const memesRef = ref(db, "memes");

    onValue(memesRef, (snapshot) => {
      if (snapshot.exists()) {
        setMemes(
          Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }))
        );
      }
    });
  };

  // ✅ Update Meme Title (Admins Only)
  const updateMeme = (memeId, newTitle) => {
    const memeRef = ref(db, `memes/${memeId}`);
    update(memeRef, { title: newTitle });
  };

  // ✅ Delete Meme (Admins Only)
  const deleteMeme = (memeId) => {
    const memeRef = ref(db, `memes/${memeId}`);
    remove(memeRef);
  };

  return userRole === "admin" ? (
    <div className="p-6">
      <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>

      <h2 className="text-lg font-semibold mt-4">Manage Memes</h2>
      {memes.map((meme) => (
        <div
          key={meme.id}
          className="flex justify-between bg-gray-100 p-4 my-2 rounded"
        >
          <span>{meme.title}</span>
          <div>
            <button
              onClick={() => updateMeme(meme.id, "Updated Title")}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => deleteMeme(meme.id)}
              className="bg-red-500 text-white px-3 py-1 rounded ml-2"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default AdminDashboard;
