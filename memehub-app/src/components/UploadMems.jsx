import React, { useState } from "react";
import {
  getDatabase,
  ref as dbRef,
  push,
  set,
  serverTimestamp,
} from "firebase/database";
import { auth } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";

const suggestedHashtags = [
  "#FunnyMemes",
  "#Trending",
  "#LOL",
  "#MemeTime",
  "#EpicFail",
  "#DankMemes",
];

const UploadMeme = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [customHashtag, setCustomHashtag] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();
  const user = auth.currentUser;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image || !user) {
      setError("Please select an image");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onload = async () => {
      const base64Image = reader.result;

      // Save to user-specific memes
      const userRef = dbRef(db, `memes/${user.uid}`);
      const newUserMemeRef = push(userRef);
     const memeData = {
  userId: user.uid,
  userName: user.email ? user.email.split("@")[0] : "Anonymous", // email prefix
  imageBase64: base64Image,
  author: user.displayName || user.email?.split("@")[0] || "anonymous",
  caption,
  hashtags,
  likes: 0,
  visibility,
  timestamp: serverTimestamp(),
};

      await set(newUserMemeRef, memeData);

      // If public, also store in public feed
      if (visibility === "public") {
        const publicRef = dbRef(db, "publicMemes");
        const newPublicMemeRef = push(publicRef);
        await set(newPublicMemeRef, {
          ...memeData,
          publicId: newPublicMemeRef.key,
        });
      }

      navigate("/dashboard");
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-100 px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Upload a Meme 🤩
        </h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleUpload} className="space-y-5">
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-lg file:cursor-pointer"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <input
            type="text"
            placeholder="Enter meme caption"
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={(e) => setCaption(e.target.value)}
            required
          />

          {/* Hashtag Selector */}
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">Suggested Hashtags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    hashtags.includes(tag)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-200 border-gray-300 hover:bg-indigo-100"
                  }`}
                  onClick={() =>
                    setHashtags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

         
          {/* Visibility Selector */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Visibility:
            </label>
            <div className="flex space-x-4">
              {["private", "public"].map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer px-4 py-2 rounded-lg border ${
                    visibility === type
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-100 hover:bg-indigo-100"
                  }`}
                >
                  <input
                    type="radio"
                    value={type}
                    checked={visibility === type}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="hidden"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-lg font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          >
            🚀 Upload Meme
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMeme;
