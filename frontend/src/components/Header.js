import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Link } from "react-scroll";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for hamburger menu
import Logo from "../images/logo.png";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MessageModal from '../components/MessageModal';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
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

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    setMessage("Successfully logged out");
    setTimeout(() => {
      navigate('/');
  }, 3000);
  };

  // Close modals
  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleSuccess = () => {
    closeModal(); // Close modal after successful login/registration
  };

  return (
    <header
      className={`w-full h-16 z-20 flex items-center transition-all duration-300 ${
        scrolled ? "text-black shadow-lg" : "text-black"
      }`}
      style={{
        backgroundColor: "white",
        transition: "background-color 0.3s ease",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <img className="h-20 w-auto" src={Logo} alt="Logo" />
        </h1>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          {menuOpen ? (
            <FiX
              className="text-3xl cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <FiMenu
              className="text-3xl cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                to="restaurants-section"
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-gray-600"
              >
                Restaurants
              </Link>
            </li>
            <li>
              <Link
                to="menu-section"
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-gray-600"
              >
                Menu
              </Link>
            </li>
            <li>
              <RouterLink to="/about-us" className="hover:text-gray-600">
                About
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact-us" className="hover:text-gray-600">
                Contact
              </RouterLink>
            </li>
            {isAuthenticated ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Register
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-3 right-3 text-2xl"
              >
                ✕
              </button>
              <ul className="space-y-6 mt-10">
                <li>
                  <Link
                    to="restaurants-section"
                    smooth={true}
                    duration={500}
                    className="block text-lg hover:text-gray-600 cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link
                    to="menu-section"
                    smooth={true}
                    duration={500}
                    className="block text-lg hover:text-gray-600 cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <RouterLink
                    to="/about-us"
                    className="block text-lg hover:text-gray-600 cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    About
                  </RouterLink>
                </li>
                <li>
                  <RouterLink
                    to="/contact-us"
                    className="block text-lg hover:text-gray-600 cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </RouterLink>
                </li>
                {isAuthenticated ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <button
                        onClick={() => {
                          setShowLogin(true);
                          setMenuOpen(false);
                        }}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setShowRegister(true);
                          setMenuOpen(false);
                        }}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Register
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {message && <MessageModal message={message} onClose={() => setMessage("")} />}

      {/* Login & Register Modals */}
      {showLogin && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button onClick={closeModal} className="absolute top-2 right-2">
              ✕
            </button>
            <Login onSuccess={handleSuccess} onSwitchToRegister={() => setShowRegister(true)} />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button onClick={closeModal} className="absolute top-2 right-2">
              ✕
            </button>
            <Register onSuccess={handleSuccess} onSwitchToLogin={() => setShowLogin(true)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
