import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const adminEmail = "anjali@gmail.com"; // Hardcoded admin email

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.email === adminEmail) {
        navigate("/analytics");
        setMessage("Welcome, Admin!");
      } else {
        setMessage("You are not an admin!");
      }

      setShowMessage(true);

      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      setMessage("Login failed: " + error.message);
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-gray-900">
      <div className="bg-white shadow-lg rounded-lg px-10 py-8 w-full max-w-md bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide text-indigo-100">
          Admin Login Page
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-indigo-400 placeholder-gray-700 placeholder-opacity-100 text-gray-900"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-indigo-400 placeholder-gray-700 placeholder-opacity-100 text-gray-900"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-lg shadow-md transition duration-300"
          >
            Login as Admin
          </button>
          {/* Success Popup */}
          {showMessage && (
            <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
              ✅ Login Successful! Redirecting... Welcome {email}
            </div>
          )}
        </form>
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginAdmin;
