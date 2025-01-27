import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../images/logo.png";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    navigate("/")
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 ${scrolled ? "text-black shadow-lg" : "text-white"}`}
      style={{ backgroundColor: scrolled ? 'white' : 'transparent',
      transition: 'background-color 0.3s ease' }}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">
          <img className="h-20 w-auto" src={Logo} alt="Logo" />
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6 items-center">
            <li className="relative group">
              <button className="hover:text-gray-300">Restaurants</button>
              <ul className="absolute hidden group-hover:block bg-white text-black p-2 rounded shadow-lg space-y-2 mt-1">
                <li>
                  <a href="#restaurant1" className="hover:bg-gray-200 block px-4 py-2">
                    Restaurant 1
                  </a>
                </li>
                <li>
                  <a href="#restaurant2" className="hover:bg-gray-200 block px-4 py-2">
                    Restaurant 2
                  </a>
                </li>
                <li>
                  <a href="#restaurant3" className="hover:bg-gray-200 block px-4 py-2">
                    Restaurant 3
                  </a>
                </li>
              </ul>
            </li>
            <li className="relative group">
              <button className="hover:text-gray-300">Menu </button>
              <ul className="absolute hidden group-hover:block bg-white text-black p-2 rounded shadow-lg space-y-2 mt-1">
                <li>
                  <a href="#burgers" className="hover:bg-gray-200 block px-4 py-2">
                    Burgers
                  </a>
                </li>
                <li>
                  <a href="#pizzas" className="hover:bg-gray-200 block px-4 py-2">
                    Pizzas
                  </a>
                </li>
                <li>
                  <a href="#drinks" className="hover:bg-gray-200 block px-4 py-2">
                    Drinks
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#about" className="hover:text-gray-300">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-300">
                Contact
              </a>
            </li>
            {isAuthenticated ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Register
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Modals */}
      {showLogin && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <Login onSwitchToRegister={() => setShowRegister(true)} />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <Register onSwitchToLogin={() => setShowLogin(true)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
