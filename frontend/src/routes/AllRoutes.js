import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";  // Home will handle authentication check
import Verify from "../pages/verify";
import RestaurantProfile from "../pages/restaurantAdmin/RestaurantProfile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RestaurantAdminDashboard from "../pages/restaurantAdmin/AdminDashboard";
import RestaurantPage from "../pages/RestaurantPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PaymentStatus from "../pages/PaymentStatus";

export const AllRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Update authentication status when the token in localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        // Listen for changes in localStorage (triggered by other tabs or windows)
        window.addEventListener("storage", handleStorageChange);

        // Set initial state on mount
        setIsAuthenticated(!!localStorage.getItem('token'));

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div>
            <Routes>
                {/* Always render Home on '/' */}
                <Route path="/" element={<Home />} />

                {/* Routes for unauthenticated users */}
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login title='login' />} />
                        <Route path="/register" element={<Register title='register' />} />
                        <Route path="/verify/:token" element={<Verify />} />
                        <Route path="/restaurantpage/:restaurantId" element={<RestaurantPage />} />
                        <Route path="/about-us" element={<About title="about us" />} />
                        <Route path="/contact-us" element={<Contact title="contact us" />} />
                    </>
                ) : (
                    <>
                        {/* Routes for authenticated users */}
                        <Route path="/home" element={<Home title='home' />} />
                        <Route path="/dashboard" element={<RestaurantAdminDashboard title='dashboard' />} />
                        <Route path="/updateprofile" element={<RestaurantProfile title='updateprofile' />} />
                        <Route path="/restaurantpage/:restaurantId" element={<RestaurantPage />} />
                        <Route path="/contact-us" element={<Contact title="contact us" />} />
                        <Route path="/about-us" element={<About title="about us" />} />
                        <Route path="/payment-status" element={<PaymentStatus title="payment-status" />} />
                    </>
                )}
            </Routes>
        </div>
    );
};
