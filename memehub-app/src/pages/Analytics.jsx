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

    fetchMemes();
  }, []);
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
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
};

export default Analytics;
// DownloadButton.jsx

const DownloadButton = () => {
  const handleClick = () => {
    logEvent("clicked_download_button", {
      item: "PDF Guide",
    });
  };

  return <button onClick={handleClick}>Download PDF</button>;
};

export { DownloadButton };
