import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import "../styles/celebration.css";

const Leaderboard = () => {
  const [userMeme, setUserMeme] = useState("");
  const [redditMeme, setRedditMeme] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { width, height } = useWindowSize();

  const fetchRedditMeme = async () => {
    const res = await fetch("https://meme-api.com/gimme");
    const data = await res.json();
    setRedditMeme(data.url);
  };

  const startBattle = () => {
    if (!userMeme || !redditMeme) return;

    const randomWinner = Math.random() < 0.5 ? "user" : "reddit";
    setWinner(randomWinner);
    setShowConfetti(true);
    setShowCelebration(true);

    // After celebration ends, show popup
    setTimeout(() => {
      setShowConfetti(false);
      setShowCelebration(false);
      setShowPopup(true);
    }, 2000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setWinner(null);
    setUserMeme("");
    fetchRedditMeme();
  };

  useEffect(() => {
    fetchRedditMeme();
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900  text-white flex flex-col items-center justify-center p-6 space-y-8 overflow-hidden">
     
      <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
        🔥 Meme Battle Area 🔥
      </h1>

      <input
        type="text"
        placeholder="Paste your meme image URL here"
        className="w-full max-w-md bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 px-4 py-2 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-md"
        value={userMeme}
        onChange={(e) => setUserMeme(e.target.value)}
        disabled={showCelebration || showPopup}
      />

      <button
        onClick={startBattle}
        className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-full font-bold text-lg shadow-xl transition-all duration-300"
        disabled={showCelebration || showPopup}
      >
        ⚔️ Start Battle!
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div
          className={`p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-xl ${
            winner === "user" ? "ring-4 ring-yellow-300" : ""
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-2">You</h2>
          {userMeme && (
            <img
              src={userMeme}
              alt="Your meme"
              className="rounded-lg object-cover w-full h-64 shadow-lg"
            />
          )}
        </div>
        <div
          className={`p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-xl ${
            winner === "reddit" ? "ring-4 ring-yellow-300" : ""
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-2">Reddit Opponent</h2>
          {redditMeme && (
            <img
              src={redditMeme}
              alt="Reddit meme"
              className="rounded-lg object-cover w-full h-64 shadow-lg"
            />
          )}
        </div>
      </div>

      {/* Confetti & Balloons */}
      {showConfetti && <Confetti width={width} height={height} />}
      {showCelebration && (
        <div className="balloons-container">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="balloon"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animationDelay: `${Math.random()}s`,
              }}
            ></div>
          ))}
          {[...Array(30)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Custom Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-4xl font-extrabold mb-4">
              🎉 {winner === "user" ? "You Win!" : "Reddit Wins!"} 🎉
            </h2>
            <button
              onClick={closePopup}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-full font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
