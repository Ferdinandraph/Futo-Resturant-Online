import React, { useState, useEffect } from "react";
import MessageModal from '../components/MessageModal'
import { useLocation, useNavigate, Navigate } from "react-router-dom";

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();

  const useQuery = () => new URLSearchParams(location.search);
  const query = useQuery();
  const verificationStatus = query.get("verification");

  useEffect(() => {
    if (verificationStatus === "success") {
      setMessage("Verification successful! You can now log in.");
      setShowModal(true)
    }
  }, [verificationStatus]);

  // Check if user is authenticated on mount
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true); // Update state if user is authenticated
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3300/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("profile", JSON.stringify(data.user));
        localStorage.setItem("email", data.user.email);
        setMessage(data.message);

        // Update auth state to re-render
        onSuccess();
        setIsAuthenticated(true);
        alert("successfully logged in")
        setMessage("successfully logged in")

        // Use navigate to redirect programmatically
        navigate("/");
        setShowModal(false)
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred during login. Please try again.");
    }
  };


  // Check if user is authenticated and redirect
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
    {/**message modal */}
    {message && (
        <MessageModal message={message} onClose={() => setMessage("")} />
      )}
      {showModal && (
      <>
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            autoComplete="off"
            className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-semibold">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </button>
      </p>
      </>
      )}
    </div>
  );
};

export default Login;
