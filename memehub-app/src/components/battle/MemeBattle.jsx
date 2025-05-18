import { getDatabase, ref, runTransaction } from "firebase/database";

const MemeBattle = ({ battle }) => {
  const db = getDatabase();
  if (!battle || !battle.memeA || !battle.memeB) {
    return (
      <p className="text-red-500 font-bold">
        ⚠️ Error: Battle data is missing!
      </p>
    );
  }
  const voteForMeme = (memeKey) => {
    const voteRef = ref(db, `battles/${battle.id}/${memeKey}`);

    runTransaction(voteRef, (currentVotes) => {
      return (currentVotes || 0) + 1;
    });
  };

  // ✅ Determine Winner in Real Time
  const winner = battle.votesA > battle.votesB ? battle.memeA : battle.memeB;

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-white shadow-md rounded-lg">
      <div className="cursor-pointer" onClick={() => voteForMeme("votesA")}>
        <img
          src={battle.memeA.imageUrl}
          alt="Meme A"
          className="w-48 rounded-lg shadow-md hover:scale-105 transition"
        />
        <p className="text-center text-lg font-bold mt-2">
          Votes: {battle.votesA}
        </p>
      </div>

      <div className="flex items-center font-extrabold text-xl text-gray-700">
        VS
      </div>

      <div className="cursor-pointer" onClick={() => voteForMeme("votesB")}>
        <img
          src={battle.memeB.imageUrl}
          alt="Meme B"
          className="w-48 rounded-lg shadow-md hover:scale-105 transition"
        />
        <p className="text-center text-lg font-bold mt-2">
          Votes: {battle.votesB}
        </p>
      </div>

      {/* 🏆 Show the Winner */}
      <div className="text-lg font-bold text-green-600 mt-3">
        🏆 Winner: {battle.votesA > battle.votesB ? "Meme A" : "Meme B"}
      </div>

      {/* 🏆 Winner Display */}
      <div className="text-lg font-bold text-green-600 mt-3">
        🏆 Winner:{" "}
        {winner.imageUrl ? (
          <img
            src={winner.imageUrl}
            alt="Winner Meme"
            className="w-24 rounded-lg"
          />
        ) : (
          "TBD"
        )}
      </div>
    </div>
  );
};

export default MemeBattle;
