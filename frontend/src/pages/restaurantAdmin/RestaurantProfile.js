import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RestaurantProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    image: null,
    contact_number: "",
  });
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Redirect if the user is not a restaurant
    if (role !== "restaurant") {
      alert("Access denied. Only restaurant admins can access this page.");
      navigate("/home");
      return;
    }

    // Fetch profile data when component mounts
    axios
      .get("http://0.0.0.0:1000/restaurant/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const { name, address, image_url, contact_number } = response.data.profile;
        setProfile({ name, address, image: image_url, contact_number });

        // Check if any required field is missing
        if (!name || !address || !contact_number) {
          setShowCompleteProfileModal(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, [navigate, role]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("address", profile.address);
    formData.append("contact_number", profile.contact_number);
    if (profile.image && profile.image instanceof File) {
      formData.append("image", profile.image);
    }

    axios
      .put("http://0.0.0.0:1000/restaurant/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Profile updated successfully");
        setShowCompleteProfileModal(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Restaurant Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold">Restaurant Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Address:</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Upload Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2"
          />
          {profile.image && !(profile.image instanceof File) && (
            <img
              src={`http://0.0.0.0:1000${profile.image}`}
              alt="Restaurant"
              className="mt-4 h-32 w-auto"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Phone Number:</label>
          <input
            type="text"
            name="contact_number"
            value={profile.contact_number}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Update Profile
        </button>
      </form>

      {/* Complete Profile Modal */}
      {showCompleteProfileModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-1/2">
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <p className="mb-4 text-gray-700">
              Please complete your profile to continue using the dashboard.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold">Restaurant Name:</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Phone Number:</label>
                <input
                  type="text"
                  name="contact_number"
                  value={profile.contact_number}
                  onChange={handleChange}
                  className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;
