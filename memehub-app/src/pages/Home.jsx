import React from 'react';

const Home = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700">
        Welcome to MemeHub
      </h1>

      {/* Meme of the Day */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Meme of the Day</h2>
        <div className="border border-dashed border-indigo-400 p-4 rounded-md text-center text-indigo-500 italic">
          {/* Placeholder for Meme of the Day content */}
          No memes yet! Come back later.
        </div>
      </section>

      {/* Weekly Leaderboard */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Weekly Leaderboard</h2>
        <div className="border border-dashed border-indigo-400 p-4 rounded-md text-center text-indigo-500 italic">
          {/* Placeholder for leaderboard */}
          Leaderboard coming soon...
        </div>
      </section>

      {/* Badge System Explanation */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Badge System</h2>
        <p className="text-gray-600">
          Earn badges like <span className="font-bold">First Viral Post</span>, <span className="font-bold">Weekly Winner</span>, and <span className="font-bold">10k Views Club</span> by creating amazing memes!
        </p>
      </section>
    </div>
  );
};

export default Home;
