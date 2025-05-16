import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup when unmounting
  }, []);

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
