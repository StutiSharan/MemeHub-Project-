import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

const ADMIN_EMAIL = "anjali@gmail.com"; // Define admin email

const ProtectedRoute = ({ children, adminOnly }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setIsAdmin(authUser.email === ADMIN_EMAIL); // Check admin role
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup when unmounting
  }, []);

  if (loading) return <p>Loading...</p>;

  // Admin-only pages should be accessible only to the admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
