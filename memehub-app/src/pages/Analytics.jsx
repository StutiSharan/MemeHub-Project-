import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const Analytics = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        setUserRole(role);

        if (role !== "admin") {
          navigate("/");
        }
      }
    };

    fetchRole();
  }, []);

  return userRole === "admin" ? (
    <div>
      <h1>📊 Admin Analytics Dashboard</h1>
      {/* Show analytics data here */}
    </div>
  ) : null;
};

export default Analytics;
