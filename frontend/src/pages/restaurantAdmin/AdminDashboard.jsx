import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageModal from '../../components/MessageModal'

const RestaurantAdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] =useState([])
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [message, setMessage] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    availability: true,
    category_name: "",
    image: null,
  });
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    description: "",
    image: null,
    contact_number: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: '',
    bankCode: '',
    accountNumber: '',
    percentageSplit: 10.5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [paymentList, setPaymentList] = useState(null);

  const url = 'http://localhost:10000';

  useEffect(() => {
    const profileString = localStorage.getItem("profile");
    const profile = profileString ? JSON.parse(profileString) : null;
    
    if (profile?.id) {
      setRestaurantId(profile.id);
    } else {
      localStorage.removeItem("profile"); // Ensure no stale data
    }
  }, []);
  

  useEffect(() => {
    if (restaurantId) {
      fetchOverview();
      fetchMenuItems();
      fetchProfile();
      fetchPaymentDetails();
    }
  }, [restaurantId]);

  useEffect(() => {
    if (profile && profile.name) {
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }, [profile]);
  

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/restaurant/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await axios.get(`${url}/restaurant/overview`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOverview(response.data);
    } catch (error) {
      console.error("Error fetching overview:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${url}/restaurant/menu/${restaurantId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMenuItems(response.data);
      setShowMenu(true);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (
      !newItem.name ||
      !newItem.price ||
      !newItem.description ||
      newItem.availability === undefined ||
      !newItem.category_name
    ) {
      setMessage("All fields are required!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("description", newItem.description);
    formData.append("availability", newItem.availability);
    formData.append("category_name", newItem.category_name); // Add category_id to form data
    if (newItem.image) formData.append("image", newItem.image);
  
    try {
      await axios.post("http://localhost:10000/restaurant/menu", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchMenuItems();
      setMessage("Menu item added successfully!");
      setShowModal(false);
      setNewItem({ name: "", price: "", description: "", availability: true, category_name: "", image: null });
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item.");
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item); // Set the item to be edited
    setEditModal(true); // Open the edit modal
  };
  

  const handleEditMenuItem = async (e) => {
    e.preventDefault();
  
    // Check if category is selected
    if (!selectedItem.category_name) {
      setMessage("Category is required!");
      return;
    }
  
    // Check if all required fields are filled
    if (!selectedItem.name || !selectedItem.price || !selectedItem.description) {
      setMessage("All fields are required!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", selectedItem.name);
    formData.append("price", selectedItem.price);
    formData.append("description", selectedItem.description);
    formData.append("availability", selectedItem.availability);
    formData.append("category_name", selectedItem.category_name); // Appending category name
    if (selectedItem.image instanceof File) formData.append("image", selectedItem.image); // If new image is selected
  
    try {
      // Make the PUT request to update the menu item
      await axios.put(`http://localhost:10000/restaurant/menu/${selectedItem.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Fetch updated menu items
      fetchMenuItems();
      
      // Success alert and closing modal
      setMessage("Menu item updated successfully!");
      setEditModal(false);
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("There was an error updating the menu item.");
    }
  };
  
  

  const handleDeleteMenuItem = async (id) => {
    try {
      await axios.delete(`http://localhost:10000/restaurant/menu/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchMenuItems();
      setMessage("Menu item deleted successfully!");
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
    setMenuItems([]); // Clear menu items
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:10000/restaurant/profile/${restaurantId}`);
      console.log(response)
      if (response.data && response.data.profile) {
        const { user_id, name, address, image_url, contact_number, description } = response.data.profile;
        const newProfile = { id: user_id, name, address, image: image_url, contact_number, description };
        setProfile(newProfile);
        localStorage.setItem("profile", JSON.stringify(newProfile));
      } else {
        setProfile({ name: "", address: "", description: "", image: null, contact_number: "" });
        localStorage.removeItem("profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile({ name: "", address: "", description: "", image: null, contact_number: "" });
      localStorage.removeItem("profile");
    }
  };
  

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfile({ ...profile, image: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("address", profile.address);
    formData.append("contact_number", profile.contact_number);
    formData.append("description", profile.description);
    if (profile.image instanceof File) formData.append("image", profile.image);

    try {
      const method = profile.id ? "put" : "post";
      const url = profile.id ? `http://localhost:10000/restaurant/profile/${profile.id}` : "http://localhost:10000/restaurant/profile";
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message || "Profile saved successfully!");
      fetchProfile();
      setShowProfileModal(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile.");
    }
  };

  const fetchPaymentDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!restaurantId || !token) {
        setError("Restaurant ID or token is missing.");
        return;
      }

      const response = await axios.get(`${url}/api/paystack/payment/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDetails(true);
      setPaymentList(response.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch payment details.");
      console.error(err);
    }
  };

  // Handle Show Details button click
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle payment information submission
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");

        if (!paymentDetails.bankCode || !paymentDetails.accountNumber || !paymentDetails.percentageSplit) {
            setMessage("Please fill all required fields.");
            return;
        }

        const payload = {
            bankCode: paymentDetails.bankCode,
            accountNumber: paymentDetails.accountNumber,
            commission: paymentDetails.percentageSplit,
        };

        const response = await axios.post(
            `${url}/api/paystack/payment`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Show success message and reset the modal
        setMessage(response.data.message || "Payment details saved successfully!");
        setPaymentDetails({
            paymentMethod: '',
            bankCode: '',
            accountNumber: '',
            percentageSplit: 10.5,
        });
        setShowPaymentModal(false);
        fetchPaymentDetails(); // Refresh the details
    } catch (error) {
        setMessage("Error saving payment details.");
        console.error(error);
    }
  };

  
  return (
    <div className="container mx-auto px-6 py-12">


      <h1 className="text-3xl font-bold mt-6 mb-4">Welcome, {profile.name}</h1>
      {console.log(profile.name)}

      {/* Profile Setup Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {profile.name ? "Update Profile" : "Complete Your Profile"}
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold">Restaurant Name:</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                {console.log(profile)}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
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
                  onChange={handleProfileChange}
                  className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Description:</label>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleProfileChange}
                  className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Upload Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleProfileChange}
                  className="mt-2"
                />
                {profile.image && (
                  typeof profile.image === "string" ?
                  (
                  <img
                    src={`http://localhost:10000/uploads/${profile.image}`}
                    alt="Restaurant"
                    className="mt-4 h-32 w-auto"
                  />
                  ): (
                    <img src={URL.createObjectURL(profile.image)} alt="Preview" />
                  )
                )}
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Save Profile
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200 ml-2"
                onClick={() => setShowProfileModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <span
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4 cursor-pointer inline-block transition duration-200 ease-in-out"
          onClick={() => {
            console.log("Span clicked!");
            setShowProfileModal(true); // Ensure this function is properly defined
          }}
          onMouseEnter={() => console.log("Hovered over the span!")} // Optional hover logging
        >
          {profile.name ? "Update Profile" : "Complete Profile"}
        </span>

      {/**message modal */}
        {message && (
          <MessageModal message={message} onClose={() => setMessage("")} />
        )}

      {/* Overview Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-500 text-white p-6 rounded shadow">
            <h3 className="text-lg font-bold">Total Menu Items</h3>
            <p className="text-2xl">{overview.totalMenuItems || 0}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded shadow">
            <h3 className="text-lg font-bold">Total Orders</h3>
            <p className="text-2xl">{overview.totalOrders || 0}</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded shadow">
            <h3 className="text-lg font-bold">Total Revenue</h3>
            <p className="text-2xl">${overview.totalRevenue || 0}</p>
          </div>
          <div className="bg-purple-500 text-white p-6 rounded shadow">
            <h3 className="text-lg font-bold">Pending Orders</h3>
            <p className="text-2xl">{overview.pendingOrders || 0}</p>
          </div>
        </div>
      </section>

      {/* Buttons for Menu Management */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-between mb-8 space-y-4 md:space-y-0">
        {/* Left section: Add Menu and Show Menus / Close Menu */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => setShowModal(true)}
          >
            Add Menu
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              if (showMenu) {
                closeMenu(); // Close the menu if it's already showing
              } else {
                fetchMenuItems(); // Show the menu if it's not showing
              }
            }}
          >
            {showMenu ? "Close Menu" : "Show Menus"}
          </button>
        </div>

        {/* Right section: Set Payment and Show Details */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => setShowPaymentModal(true)}
          >
            Set Payment
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              if (showDetails) {
                handleCloseDetails(); // Close details if they're already showing
              } else {
                fetchPaymentDetails(); // Show the payment details if not showing
              }
            }}
          >
            {showDetails ? "Close Details" : "Show Details"}
          </button>
        </div>
      </div>


      {/* List of Menu Items */}
{menuItems.length > 0 && (
  <div className="grid gap-6">
    {menuItems.map((item) => (
      <div
        key={item.id}
        className="flex flex-col sm:flex-row items-center p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        {/* Image on the left */}
        <img
          src={
            item.picture_url instanceof File
              ? URL.createObjectURL(item.picture_url)
              : `http://localhost:10000/uploads/${item.picture_url}`
          }
          alt={item.name}
          className="w-full sm:w-28 h-28 object-cover rounded-lg mb-4 sm:mb-0"
        />

        {/* Content in the center */}
        <div className="flex-1 text-center sm:text-left px-4 sm:px-6">
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        </div>

        {/* Price on the right */}
        <div className="text-center sm:text-right mt-4 sm:mt-0">
          <p className="text-lg font-bold text-green-600">₦{item.price}</p>
        </div>

       {/* Buttons */}
      <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
        {/* Edit Button */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105"
          onClick={() => handleEditClick(item)}
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105"
          onClick={() => handleDeleteMenuItem(item.id)}
        >
          Delete
        </button>
      </div>
      </div>
    ))}
  </div>
)}
      {/* Add Menu Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-1/2">
            <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
            <form onSubmit={handleAddMenuItem}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Category:</label>
                <select
                  value={newItem.category_name}
                  onChange={(e) => setNewItem({ ...newItem, category_name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Image:</label>
                <input
                  type="file"
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" type="submit">
                Add Item
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {editModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleEditMenuItem}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={selectedItem.name}
                  onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  value={selectedItem.price}
                  onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Category:</label>
                <select
                  value={selectedItem.category_name}
                  onChange={(e) => setSelectedItem({ ...selectedItem, category_name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  {/* Assuming categories is an array of category names */}
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Image:</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedItem({ ...selectedItem, image: e.target.files[0] })}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" type="submit">
                Update Item
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

  
      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-1/2">
            <h2 className="text-2xl font-bold mb-4">Add Payment Details</h2>

            {/* Message Display */}
            {message && (
              <div
                className={`mb-4 p-2 text-center rounded ${
                  message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-6">
              {/* Payment Method */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={paymentDetails.paymentMethod}
                  onChange={handlePaymentChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                >
                  <option value="">Select Payment Method</option>
                  <option value="paystack">Paystack</option>
                </select>
              </div>

              {/* Bank Code */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bank Code</label>
                <input
                  type="text"
                  name="bankCode"
                  value={paymentDetails.bankCode}
                  onChange={handlePaymentChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                  placeholder="Enter your bank code"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={paymentDetails.accountNumber}
                  onChange={handlePaymentChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                  placeholder="Enter your account number"
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end space-x-4 mt-4">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Save Payment Details
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowPaymentModal(false)} // Close modal
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Display Payment Details */}

      {showDetails && paymentList ? (
      <div className="bg-white p-6 shadow-lg rounded-lg space-y-4">
        <p className="text-lg font-semibold text-gray-800">
          <strong>Bank Code:</strong> {paymentList.bank_code}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          <strong>Account Number:</strong> {paymentList.account_number}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          <strong>Commission Percentage:</strong> {paymentList.commission_percentage}%
        </p>
        <p className="text-lg font-semibold text-gray-800">
          <strong>Subaccount Code:</strong> {paymentList.subaccount_code}
        </p>
      </div>
    ) : (
      showDetails && !paymentDetails && !error && <p className="text-gray-600">Loading payment details...</p>
    )}

    </div>
  );
};

export default RestaurantAdminDashboard;

