import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
  push,
} from "firebase/database";
import MemeBattle from "./MemeBattle";

const MemeBattleFeed = () => {
  const [battles, setBattles] = useState([]);
  const [submittedMemes, setSubmittedMemes] = useState([]);
  const db = getDatabase();

  // ✅ Fetch submitted memes from Firebase
  useEffect(() => {
    const memesRef = ref(db, "submittedMemes");
    onValue(memesRef, (snapshot) => {
      const memesData = snapshot.val() || {};
      setSubmittedMemes(Object.values(memesData));
    });
  }, []);

  // ✅ Function to create a new battle
  const createBattle = () => {
    console.log("Submitted Memes:", submittedMemes);
    if (submittedMemes.length < 2) return alert("Need at least 2 memes!");

    // ✅ Convert Firebase object into an array of memes with keys
    const memesArray = Object.entries(submittedMemes).map(([key, value]) => ({
      id: key, // ✅ Use Firebase key as meme ID
      ...value,
    }));

    // ✅ Shuffle memes & select two for battle
    const shuffled = memesArray.sort(() => 0.5 - Math.random());
    const memeA = shuffled[0];
    const memeB = shuffled[1];

    if (!memeA || !memeB || !memeA.imageUrl || !memeB.imageUrl) {
      return alert("Error: Meme data is missing or corrupted.");
    }

    // ✅ Define battle object with proper IDs
    const battleRef = push(ref(db, "battles"));
    const newBattle = {
      id: battleRef.key,
      memeA: { id: memeA.id, imageUrl: memeA.imageUrl },
      memeB: { id: memeB.id, imageUrl: memeB.imageUrl },
      votesA: 0,
      votesB: 0,
      winner: null,
    };

    // ✅ Store battle in Firebase

    push(ref(db, "battles"), newBattle);
    setBattles((prev) => [...prev, newBattle]);
    alert("New Battle Created!");
  };

  // ✅ Fetch battles & track updates in real time
  useEffect(() => {
    const battlesRef = ref(db, "battles");

    onValue(battlesRef, (snapshot) => {
      const battleData = snapshot.val() || {};
      setBattles(
        Object.keys(battleData).map((id) => ({ id, ...battleData[id] }))
      );
    });
  }, []);

  // ✅ Function to determine winner & update Firebase
  const determineWinner = (battle) => {
    if (!battle || battle.votesA === battle.votesB) return null; // Handle tie case

    const winner = battle.votesA > battle.votesB ? battle.memeA : battle.memeB;

    // ✅ Update winner in Firebase
    const battleRef = ref(db, `battles/${battle.id}/winner`);
    runTransaction(battleRef, () => winner);

    return winner;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-center text-yellow-500 text-2xl font-bold">
        🔥 Meme Battles 🔥
      </h2>

      {/* ✅ Start New Battle Button */}
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={createBattle}
      >
        Start a Meme Battle
      </button>

      {/* ✅ Show message if no active battles */}
      {battles.length === 0 ? (
        <p className="text-center text-red-500 font-bold">
          ⚠️ No active battles available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {battles.map((battle) => {
            const winner = determineWinner(battle);

            return (
              <div
                key={battle.id}
                className="p-4 bg-white shadow-md rounded-lg"
              >
                <MemeBattle battle={battle} />

                {/* 🏆 Winner Display */}
                {winner && (
                  <p className="text-center text-lg font-bold mt-2 text-green-600">
                    🏆 Winner:{" "}
                    <img
                      src={winner.imageUrl}
                      alt="Winning Meme"
                      className="w-24 rounded-lg shadow-md"
                    />
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemeBattleFeed;
