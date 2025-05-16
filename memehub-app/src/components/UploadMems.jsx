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
      const memesRef = dbRef(db, `memes/${user.uid}`);
      const newMemeRef = push(memesRef);

      await set(newMemeRef, {
        userId: user.uid,
        imageBase64: reader.result,
        caption,
        hashtags,
        likes: 0, // Initialize likes count
        timestamp: serverTimestamp(),
      });

      navigate("/dashboard");
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
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

          {/* Suggested Hashtags */}
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">Select Hashtags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`px-2 py-1 border rounded text-sm ${
                    hashtags.includes(tag)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
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

          {/* Custom Hashtag Input */}
          <input
            type="text"
            placeholder="Add your own hashtag"
            className="w-full p-2 border rounded"
            value={customHashtag}
            onChange={(e) => setCustomHashtag(e.target.value)}
          />
          <button
            type="button"
            className="w-full py-2 bg-gray-500 text-white rounded"
            onClick={() => {
              if (customHashtag && !hashtags.includes(customHashtag)) {
                setHashtags([...hashtags, customHashtag]);
                setCustomHashtag("");
              }
            }}
          >
            ➕ Add Hashtag
          </button>

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
