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
   <>
   </>
  );
};

export default MemeSubmit;
