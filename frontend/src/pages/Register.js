import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessageModal from '../components/MessageModal'

const Register = ({onSuccess, onSwitchToLogin}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer"); // Default role
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(true)

    const REACT_APP_API_UR = process.env.REACT_APP_API_UR;
    
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent form submission

        try {
            const response = await axios.post(`${REACT_APP_API_UR}/auth/register`, {
                name,
                email,
                password,
                role, 
            });
            console.log(response.data);

            alert("successfully registered. please verify email to continue.....")
            setMessage("successfully registered. please verify email to continue.....")
            onSuccess();
            navigate("");
            setShowModal(false)
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("resgistration unsuccessful email already used")
        }
    };

    return (
        <div>
          { showModal && (
            <>
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
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
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-500 hover:underline"
            >
              Login
            </button>
          </p>
          </>
          )}
          {/**message modal */}
          {message && (
            <MessageModal message={message} onClose={() => setMessage("")} />
          )}
        </div>
      );
};

export default Register;
