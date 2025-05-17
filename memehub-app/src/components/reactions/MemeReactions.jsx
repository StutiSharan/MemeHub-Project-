import { getDatabase, ref, runTransaction } from "firebase/database";

const reactions = ["🔥", "😂", "👍", "🤯"];

const MemeReactions = ({ memeId }) => {
  const handleReaction = (emoji) => {
    updateReaction(memeId, emoji);
  };

  const updateReaction = (memeId, emoji) => {
    const db = getDatabase();
    const reactionRef = ref(db, `reactions/${memeId}/${emoji}`);

    runTransaction(reactionRef, (currentValue) => {
      return (currentValue || 0) + 1; // Increment reaction count
    });
  };

  return (
    <div className="flex gap-4 mt-3">
      {reactions.map((emoji) => (
        <button
          key={emoji}
          className="text-2xl hover:scale-110 transition"
          onClick={() => handleReaction(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default MemeReactions;
