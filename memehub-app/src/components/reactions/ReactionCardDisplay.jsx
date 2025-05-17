import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";

const MemeReactionsDisplay = ({ memeId }) => {
  const [reactions, setReactions] = useState({});
  const db = getDatabase();

  useEffect(() => {
    const reactionRef = ref(db, `reactions/${memeId}`);
    const unsubscribe = onValue(reactionRef, (snapshot) => {
      setReactions(snapshot.val() || {});
    });

    return () => unsubscribe();
  }, [memeId]);

  return (
    <div className="flex gap-4 mt-3 text-xl">
      {Object.entries(reactions).map(([emoji, count]) => (
        <span key={emoji} className="font-bold">
          {emoji} {count}
        </span>
      ))}
    </div>
  );
};

export default MemeReactionsDisplay;
