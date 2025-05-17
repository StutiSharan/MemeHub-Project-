// AnalyticsTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "../utils/firebaseConfig";
import {
  logEvent as firebaseLogEvent,
  setUserProperties,
} from "firebase/analytics";

// 🔁 Automatically track page views on route change
const Analytics = () => {
  const location = useLocation();

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
