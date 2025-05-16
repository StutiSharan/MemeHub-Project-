import React from 'react';
import MemeCard from '../components/MemeCard';
import memes from '../utils/sampleMemes';
import MemeCarousel from '../components/MemeCarousel';

const Home = () => {
  const memeOfTheDay = memes[0];  // Use first meme as meme of the day
  const topMemes = memes.slice(1, 6); // Next 5 memes as leaderboard

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700">
        Welcome to MemeHub
      </h1>

      {/* Meme of the Day + Top Featured Carousel in Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meme of the Day */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700 text-center md:text-left">
            Meme of the Day
          </h2>
          <MemeCard meme={memeOfTheDay} highlight={true} />
        </div>

        {/* Meme Carousel Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700 text-center md:text-left">
            Top Trending Memes
          </h2>
          <MemeCarousel memes={memes.slice(2, 8)} />
        </div>
      </section>

      {/* Weekly Leaderboard */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Weekly Leaderboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topMemes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      </section>

      {/* Badge System */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Badge System</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><span className="font-bold">First Viral Post:</span> Your first meme to hit 1k+ views</li>
          <li><span className="font-bold">Weekly Winner:</span> Top meme in a 7-day span</li>
          <li><span className="font-bold">10k Views Club:</span> Exclusive club for viral creators</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
