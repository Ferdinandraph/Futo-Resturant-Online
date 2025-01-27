import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Base from "../pages/Base";
import Verify from "../pages/verify";
import RestaurantProfile from "../pages/restaurantAdmin/RestaurantProfile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RestaurantAdminDashboard from "../pages/restaurantAdmin/AdminDashboard";
import RestaurantPage from "../pages/RestaurantPage";

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
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div>
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login title='login' />} />
                        <Route path="/register" element={<Register title='register' />} />
                        <Route path="/" element={<Base title='base' />} />
                        <Route path="/verify/:token" element={<Verify />} />
                        <Route path="/restaurantpage/:restaurantId" element={<RestaurantPage />} />
                    </>
                ) : (
                    <>
                        <Route path="/home" element={<Home title='home' />} />
                        <Route path="/dashboard" element={<RestaurantAdminDashboard title='dashboard' />} />
                        <Route path="/updateprofile" element={<RestaurantProfile title='updateprofile' />} />
                        <Route path="/restaurantpage/:restaurantId" element={<RestaurantPage />} />
                    </>
                )}
            </Routes>
        </div>
    );
};
