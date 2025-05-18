import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import MemeBattleFeed from "../components/battle/MemeBattleFeed";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const leaderboardRef = ref(db, "leaderboard");

    onValue(leaderboardRef, (snapshot) => {
      const leaderboardData = snapshot.val() || {};
      const sortedLeaders = Object.entries(leaderboardData)
        .map(([id, score]) => ({ id, score }))
        .sort((a, b) => b.score - a.score); // Sort by highest score

      setLeaders(sortedLeaders);
    });
  }, []);

  return (
    <div className="space-y-10 bg-indigo-500 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
      {/* 🔥 Show Active Meme Battles */}
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        🔥 Meme Battles 🔥
      </h2>
      <MemeBattleFeed />

      {/* 🏆 Show Leaderboard Rankings */}
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">
        🏆 Meme Battle Leaderboard 🏆
      </h2>
      <ul className="space-y-3">
        {leaders.map((meme, index) => (
          <li key={meme.id} className="text-lg font-semibold text-gray-800">
            🏅 {index + 1}. Meme #{meme.id} - {meme.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
