import React from 'react';
import MemeCard from '../components/MemeCard';
import memes from '../utils/sampleMemes';
import MemeCarousel from '../components/MemeCarousel';
import { Link } from 'react-router-dom';
import { FaFireAlt, FaCrown, FaRocket } from 'react-icons/fa';
import { ArrowRight } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { FiBell } from "react-icons/fi";
import clsx from 'clsx'
import { useState,useEffect } from 'react';
const Home = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const memeOfTheDay = memes[0];
  const topMemes = memes.slice(1, 6);
  const redirectLink = user ? '/feed' : '/signup';


  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
     <div
      className={clsx(
        "space-y-10 px-4 sm:px-6 lg:px-16 py-6 min-h-screen text-white select-none transition-all duration-500",
        darkMode
          ? "bg-black"
          : "bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"
      )}
    >
    {/* 🎉 Marquee Banner */}
<div className="bg-yellow-400 text-black font-extrabold py-2 rounded-full text-center overflow-hidden shadow-lg mb-6">
  <p className="animate-marquee text-sm sm:text-lg flex gap-4  text-center whitespace-nowrap crinkle">
    🥳 Welcome to Meme Madness Central! 🚀 Post memes, earn badges, conquer the leaderboard! 😂🔥💀👑
  </p>
</div>

{/* 🌀 Logo + Title */}
<div className="flex justify-center items-center space-x-4 relative mb-8 sm:mb-10">
        <div className="text-4xl sm:text-6xl animate-spin-slow">🤣</div>
        <h1 className="text-3xl sm:text-6xl font-black tracking-wide text-center pulse-bold">JokeJunction</h1>

        {/* Bell Icon - Swinging and Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute right-2 sm:right-8 top-1 sm:top-2 transform origin-top-center animate-swing"
        >
          <FiBell className="text-yellow-400 hover:scale-110 transition-transform" size={36} />
        </button>
      </div>



      {/* Welcome Section */}
      <div className="text-center space-y-4 sm:space-y-5 bg-gradient-to-r from-pink-700 via-purple-800 to-indigo-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border-2 sm:border-4 border-yellow-300">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-yellow-300 drop-shadow-lg">
          Enter the Meme Realm
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-yellow-100 max-w-xl mx-auto">
        Step into the wild world of memes — from savage to silly, trending to underground. Embrace the madness, chase the laughs, and unleash your inner meme lord.
        </p>
        <Link
  to="/feed"
  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-indigo-900 px-6 sm:px-8 py-3 sm:py-4 mt-4 rounded-full text-lg sm:text-xl font-extrabold shadow-xl transition-transform duration-300"
>
  <span className="crinkle">Start Meme-ing</span> <ArrowRight size={20} />
</Link>

      </div>

      {/* Meme of the Day + Carousel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Meme of the Day */}
        <div className="relative bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 rounded-2xl sm:rounded-3xl p-1 sm:p-2 shadow-xl border-2 sm:border-4 border-yellow-300 transition duration-500">
          <div className="bg-black bg-opacity-70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col items-center relative">
            <div className="absolute -top-4 left-4 bg-yellow-400 text-indigo-900 font-bold px-4 py-1 rounded-full shadow text-xs sm:text-sm uppercase">
              Featured
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-yellow-300 mb-4 sm:mb-6 drop-shadow">
              Meme of the Day
            </h3>
            <div className="transform transition duration-300 shadow-yellow-300 shadow-md rounded-2xl overflow-hidden w-full">
              <Link to={redirectLink} tabIndex={-1}>
                <MemeCard meme={memeOfTheDay} highlight={true} />
              </Link>
            </div>
          </div>
        </div>

        {/* Meme Carousel */}
        <div className="bg-black bg-opacity-60 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-yellow-400 shadow-md transition duration-300">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 text-yellow-300 tracking-wide">Top Trending Memes</h3>
          <MemeCarousel memes={memes.slice(2, 8)} />
        </div>
      </section>

      {/* Weekly Leaderboard */}
      <section className="bg-black bg-opacity-50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-yellow-400 shadow-lg transition duration-300">
        <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-yellow-300 tracking-wide">Weekly Leaderboard</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {topMemes.map((meme) => (
            <Link key={meme.id} to={redirectLink} className="block transform transition-transform duration-300">
              <MemeCard meme={meme} />
            </Link>
          ))}
        </div>
      </section>

      {/* Badge System */}
      <section className="bg-black bg-opacity-40 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-yellow-400 shadow-md transition duration-300">
        <h3 className="text-2xl sm:text-3xl font-extrabold mb-6 text-yellow-300 tracking-wide">Badge System</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">

          {/* Badge 1 */}
          <div className="group bg-yellow-400 bg-opacity-20 rounded-xl p-5 shadow border-l-4 sm:border-l-8 border-red-500">
            <div className="flex items-center gap-4">
              <div className="text-red-600 text-3xl sm:text-4xl"><FaFireAlt /></div>
              <div>
                <h4 className="text-lg sm:text-2xl font-extrabold text-red-600">First Viral Post</h4>
                <p className="text-sm sm:text-lg text-yellow-50">Your first meme to hit 1k+ views.</p>
              </div>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="group bg-yellow-400 bg-opacity-20 rounded-xl p-5 shadow border-l-4 sm:border-l-8 border-yellow-400">
            <div className="flex items-center gap-4">
              <div className="text-orange-800 text-3xl sm:text-4xl"><FaCrown /></div>
              <div>
                <h4 className="text-lg sm:text-2xl font-extrabold text-orange-600">Weekly Winner</h4>
                <p className="text-sm sm:text-lg text-yellow-50">Top meme in a 7-day span.</p>
              </div>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="group bg-yellow-400 bg-opacity-20 rounded-xl p-5 shadow border-l-4 sm:border-l-8 border-purple-600">
            <div className="flex items-center gap-4">
              <div className="text-purple-600 text-3xl sm:text-4xl"><FaRocket /></div>
              <div>
                <h4 className="text-lg sm:text-2xl font-extrabold text-purple-500">10K Views Club</h4>
                <p className="text-sm sm:text-lg text-yellow-50">Exclusive club for viral creators.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
