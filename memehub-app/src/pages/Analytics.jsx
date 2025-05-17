<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
import { database } from "../utils/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MemeChart = ({ votes }) => {
  const [chartData, setChartData] = useState(null);
  const voteDataRef = useRef(Array(20).fill(votes));
  const intervalRef = useRef(null);

  useEffect(() => {
    voteDataRef.current =
      voteDataRef.current.length === 20 ? voteDataRef.current : Array(20).fill(votes);
=======
// <<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Line } from "react-chartjs-2";
import moment from "moment";
// =======
// AnalyticsTracker.jsx
import { useLocation } from "react-router-dom";
import { analytics } from "../utils/firebaseConfig";
import {
  logEvent as firebaseLogEvent,
  setUserProperties,
} from "firebase/analytics";
// >>>>>>> ee79e1bb371df6bea045799c8aa16f6e060304ef

// 🔁 Automatically track page views on route change
const Analytics = () => {
  // <<<<<<< HEAD
  const [memes, setMemes] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const location = useLocation();

  useEffect(() => {
    const fetchMemes = async () => {
      const q = query(
        collection(db, "memes"),
        where("postedBy", "==", auth.currentUser)
      );
      const snapshot = await getDocs(q);
      const memeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemes(memeData);
    };
>>>>>>> b9ba04d30735dff4a944a67791c9d2fe48fa6b16

    setChartData({
      labels: Array.from({ length: 20 }, (_, i) => `T-${19 - i}`),
      datasets: [
        {
          label: "Votes",
          data: voteDataRef.current,
          fill: true,
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          borderColor: "#6366F1",
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    });

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const latestVotes = votes;
      const last = voteDataRef.current[voteDataRef.current.length - 1];
      const next =
        last < latestVotes ? last + 1 : last > latestVotes ? last - 1 : last;

      voteDataRef.current.shift();
      voteDataRef.current.push(next);

      setChartData((prev) => ({
        ...prev,
        datasets: [{ ...prev.datasets[0], data: [...voteDataRef.current] }],
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [votes]);

  if (!chartData) return null;

  return (
    <div className="mt-4 w-full h-48">
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#6366F1",
              titleColor: "white",
              bodyColor: "white",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
              grid: { color: "#e5e7eb" },
            },
            x: {
              grid: { color: "#e5e7eb" },
            },
          },
          animation: {
            duration: 1000,
            easing: "easeInOutQuad",
          },
        }}
      />
    </div>
  );
};

// Helper to get total votes from localStorage data which might be number or nested objects
const getTotalVotes = (voteEntry) => {
  if (typeof voteEntry === "number") {
    return voteEntry;
  }
  if (typeof voteEntry === "object" && voteEntry !== null) {
    return Object.values(voteEntry).reduce((acc, v) => acc + (Number(v) || 0), 0);
  }
  return 0;
};

const Analytics = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState(() => JSON.parse(localStorage.getItem("memeVotes")) || {});

  const fetchMemes = () => {
    const memesRef = ref(database, "publicMemes");
    onValue(
      memesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const memesList = Object.entries(data).map(([id, meme]) => ({
            id,
            ...meme,
            votes: getTotalVotes(votes[id]) || Number(meme.votes) || 0,
          }));
          setMemes(memesList);
        } else {
          setMemes([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching memes:", err);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchMemes();
  }, []);
<<<<<<< HEAD

  // Listen for vote updates (dispatched elsewhere, e.g. feed page)
  useEffect(() => {
    const onVotesChange = () => {
      const updatedVotes = JSON.parse(localStorage.getItem("memeVotes")) || {};
      setVotes(updatedVotes);

      setMemes((prevMemes) =>
        prevMemes.map((meme) => ({
          ...meme,
          votes: getTotalVotes(updatedVotes[meme.id]) || Number(meme.votes) || 0,
        }))
      );
    };

    window.addEventListener("memeVotesUpdated", onVotesChange);
    return () => window.removeEventListener("memeVotesUpdated", onVotesChange);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-semibold text-indigo-600">Loading Analytics...</p>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-semibold text-red-500">No memes found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <h1 className="text-4xl text-center font-bold text-indigo-700 mb-10">
        📊 Meme Analytics Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memes.map((meme) => (
          <div key={meme.id} className="bg-white shadow-md p-4 rounded-xl border">
            <div className="flex items-center space-x-4 mb-3">
              {meme.imageBase64 ? (
                <img
                  src={meme.imageBase64}
                  alt="Meme"
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-indigo-800">{meme.caption || "Untitled"}</h2>
                <p className="text-sm text-gray-500">
                  🕒 {meme.timestamp ? moment(meme.timestamp).fromNow() : "Unknown time"}
                </p>
                <p className="text-sm text-indigo-600 mt-1 font-mono">
                  {meme.hashtags?.map((tag) => `#${tag}`).join(" ") || "No hashtags"}
                </p>
              </div>
=======
  useEffect(() => {
    firebaseLogEvent(analytics, "page_view", {
      page_path: location.pathname,
    });
  }, [location]);
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Your Meme Analytics</h2>
      {memes.map((meme) => (
        <div key={meme.id} className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <img
              src={meme.imageUrl}
              alt={meme.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="ml-4">
              <h3 className="text-xl font-semibold">{meme.title}</h3>
              <p>🕒 {moment(meme.timestamp).fromNow()}</p>
              <p>👀 Views: {meme.views}</p>
              <p>👍 Upvotes: {meme.upvotes}</p>
              <p>👎 Downvotes: {meme.downvotes}</p>
              <p>📊 Net: {meme.upvotes - meme.downvotes}</p>
            </div>
          </div>

          {meme.engagementHistory && (
            <div className="mt-4">
              <Line
                data={{
                  labels: meme.engagementHistory.map((e) =>
                    moment(e.time).format("HH:mm")
                  ),
                  datasets: [
                    {
                      label: "Views",
                      data: meme.engagementHistory.map((e) => e.views),
                      fill: false,
                      borderColor: "#6366f1",
                      tension: 0.4,
                    },
                  ],
                }}
              />
>>>>>>> b9ba04d30735dff4a944a67791c9d2fe48fa6b16
            </div>
            <p className="font-bold text-green-600 text-lg">🗳 Votes: {meme.votes}</p>

            <MemeChart votes={meme.votes} />
          </div>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
=======
  // =======

  useEffect(() => {
    firebaseLogEvent(analytics, "page_view", {
      page_path: location.pathname,
    });
  }, [location]);

  return null;
};

// 🔧 Exported helper function for custom events
export const logEvent = (eventName, params = {}) => {
  firebaseLogEvent(analytics, eventName, params);
};

// 👤 Optional: Exported function to set user properties
export const setUser = (properties) => {
  setUserProperties(analytics, properties);
  // >>>>>>> ee79e1bb371df6bea045799c8aa16f6e060304ef
>>>>>>> b9ba04d30735dff4a944a67791c9d2fe48fa6b16
};

export default Analytics;
