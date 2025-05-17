import { useEffect, useState } from "react";
import { auth } from "../utils/firebaseConfig";
import Analytics from "../pages/Analytics";

const ADMIN_EMAIL = "anjali@gmail.com"; // Predefined admin email

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAdmin(loggedInUser.email === ADMIN_EMAIL);
      }
    });
    return () => unsubscribe();
  }, []);

  return isAdmin ? (
    <div>
      {/* Admin Header with Logo */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        <img
          src="/admin-logo.pnghttps://i.pinimg.com/736x/76/4e/cf/764ecf6c9e723a11bf63509d4fb91837.jpg" // ✅ Make sure you have an admin logo in `public`
          alt="Admin Logo"
          width="30"
          height="30"
          style={{ borderRadius: "50%" }}
        />
        <span className="font-semibold">Admin</span>
      </div>

      {/* Load Analytics Dashboard */}
      <Analytics />
    </div>
  ) : (
    <h2>Access Denied: Admins Only</h2>
  );
};

export default AdminDashboard;
