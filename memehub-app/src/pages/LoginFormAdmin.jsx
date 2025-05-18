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

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user.email === adminEmail) {
      setMessage("Welcome, Admin!");
      setShowMessage(true);

      // Clear input fields before redirecting
      setEmail("");
      setPassword("");

      setTimeout(() => {
        setShowMessage(false);
        navigate("/analytics"); // redirect AFTER clearing input
      }, 1500);
    } else {
      setMessage("You are not an admin!");
      setShowMessage(true);

      // Clear only email for security
      setEmail("");
      setPassword("");
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  } catch (error) {
    setMessage("Login failed: " + error.message);
    setShowMessage(true);
    setEmail(""); // Optional: clear fields after failed attempt
    setPassword("");
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  }
};

  return (
  <div className="min-h-[500px] bg-white shadow-lg rounded-lg px-10 py-8 w-full max-w-md bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white flex flex-col justify-center">

        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide text-indigo-100">
          Admin Login Page
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
      
          <input
  type="email"
   placeholder="Email"
  className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-indigo-400 placeholder-gray-700 placeholder-opacity-100 text-gray-900"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
      autoComplete="off" 

/>

<input
  type="password"
 placeholder="Password (min 6 characters)"
  className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-indigo-400 placeholder-gray-700 placeholder-opacity-100 text-gray-900"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
    autoComplete="new-password" 
/>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-lg shadow-md transition duration-300"
          >
            Login as Admin
          </button>
          {/* Success Popup */}
         {showMessage && (
  <div className={`fixed top-2 left-1/2 transform -translate-x-1/2 ${
    email === adminEmail ? "bg-green-500" : "bg-red-500"
  } text-white px-4 py-2 rounded-lg shadow-md z-50`}>
    {email === adminEmail
      ? `✅ Login Successful! Redirecting... Welcome ${email}`
      : "⛔ You are not an admin!"}
  </div>
)}

        </form>
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}
      </div>
    
  );
};

export default LoginAdmin;
