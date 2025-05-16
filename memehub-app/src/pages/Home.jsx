import React from 'react';
import MemeCard from '../components/MemeCard';
import memes from '../utils/sampleMemes';
import MemeCarousel from '../components/MemeCarousel';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const memeOfTheDay = memes[0];
  const topMemes = memes.slice(1, 6);

  return (
    <div className="space-y-12 px-4 md:px-8 lg:px-16 py-10 bg-gray-50">
      {/* Welcome Section */}
      <div className="text-center space-y-5 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl p-10 shadow-lg">
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md hover:scale-105 transition duration-300">
          Welcome to MemeHub
        </h1>

        <p className="text-lg text-gray-700 max-w-3xl mx-auto hover:text-indigo-600 transition-colors duration-300">
          MemeHub is your ultimate destination for sharing, discovering, and celebrating internet culture through memes.
          Whether you're a seasoned meme-lord or a casual scroller, this is the platform where humor meets community.
        </p>

        <p className="text-lg text-gray-700 max-w-3xl mx-auto hover:text-purple-600 transition-colors duration-300">
          Explore daily highlights, top trending posts, and climb the leaderboard as a content creator.
          Unlock exclusive badges, connect with fellow meme enthusiasts, and fuel the fun — one meme at a time.
        </p>

        {/* CTA Button */}
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 mt-4 rounded-full text-base font-semibold transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105"
        >
          Browse Feed <ArrowRight size={18} />
        </Link>
      </div>

      {/* Meme of the Day + Carousel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meme of the Day */}
        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-shadow duration-500 cursor-pointer">
          <div className="bg-white rounded-3xl p-6 flex flex-col items-center">
            {/* Featured Badge */}
            <div className="absolute -top-3 left-4 bg-yellow-400 text-indigo-900 font-bold px-4 py-1 rounded-full shadow-lg text-sm select-none tracking-wider uppercase">
              Featured
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-4 drop-shadow-md">
              Meme of the Day
            </h2>

            {/* MemeCard wrapper */}
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg hover:scale-105 transform transition duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 opacity-20 blur-xl pointer-events-none rounded-2xl"></div>
              <MemeCard meme={memeOfTheDay} highlight={true} />
            </div>
          </div>
        </div>

        {/* Meme Carousel Section */}
        <div className="bg-indigo-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Top Trending Memes</h2>
          <MemeCarousel memes={memes.slice(2, 8)} />
        </div>
      </section>

      {/* Weekly Leaderboard */}
      <section className="bg-indigo-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Weekly Leaderboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topMemes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      </section>

      {/* Badge System */}
      <section className="bg-indigo-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Badge System</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
          <li>
            <span className="font-semibold text-indigo-800">First Viral Post:</span> Your first meme to hit 1k+ views.
          </li>
          <li>
            <span className="font-semibold text-indigo-800">Weekly Winner:</span> Top meme in a 7-day span.
          </li>
          <li>
            <span className="font-semibold text-indigo-800">10k Views Club:</span> Exclusive club for viral creators.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
