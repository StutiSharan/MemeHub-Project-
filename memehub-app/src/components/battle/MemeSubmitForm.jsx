import { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";

const MemeSubmit = () => {
  const [memeUrl, setMemeUrl] = useState("");
  const db = getDatabase();

  const handleSubmit = () => {
    if (!memeUrl) return alert("Please enter a meme URL!");

    // ✅ Add meme to Firebase for battle pairing
    const memeRef = ref(db, "submittedMemes");
    push(memeRef, { imageUrl: memeUrl, votes: 0 });

    alert("Meme submitted! It will be paired for battle.");
    setMemeUrl("");
  };

  return (
    <div className="p-4 shadow-md rounded-lg">
      <h2 className="text-xl font-bold">Submit Your Meme for Battle!</h2>
      <input
        type="text"
        className="border p-2 rounded w-full mt-2"
        placeholder="Paste Meme Image URL..."
        value={memeUrl}
        onChange={(e) => setMemeUrl(e.target.value)}
      />
      <button
        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        onClick={handleSubmit}
      >
        Submit Meme
      </button>
    </div>
  );
};

export default MemeSubmit;
