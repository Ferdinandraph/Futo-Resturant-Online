import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import axios from "axios";
import carousel3 from '../images/carousel3.jpg';
import MessageModal from '../components/MessageModal';
import Login from "../pages/Login";
import Register from "../pages/Register";

const RestaurantPage = () => {
  const [restaurant, setRestaurant] = useState([]);
  const { restaurantId } = useParams();
  const [orderType, setOrderType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const token = localStorage.getItem('token');
  const REACT_APP_API_UR = process.env.REACT_APP_API_UR;

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantResponse = await axios.get(`${REACT_APP_API_UR}/restaurant/profile/${restaurantId}`);
        setRestaurant(restaurantResponse.data.profile);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
      }
    };

    const fetchMenuData = async () => {
      try {
        const menuResponse = await axios.get(`${REACT_APP_API_UR}/restaurant/menu/${restaurantId}`);
        setMenu(menuResponse.data);
        setFilteredMenu(menuResponse.data);
      } catch (err) {
        console.error('Error fetching menu:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(`${REACT_APP_API_UR}/restaurant/categories`);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchRestaurantData();
    fetchMenuData();
    fetchCategories();
  }, [restaurantId]);

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowModal(false);
  };

  const handleSuccess = () => {
    closeModal();
  };

  const handleOrderNow = (item) => {
    if (!localStorage.getItem("token")) {
      setShowLogin(true);
      return;
    }
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
  };

  const handleConfirmOrder = () => {
    if (!quantity || (orderType === "delivery" && !location)) {
      setMessage("Please fill in all required fields.");
      return;
    }
    processOrder(orderType);
    setShowModal(false);
  };

  let totalPrice = selectedItem ? selectedItem.price * quantity : 0;
  if (orderType === "delivery") {
    totalPrice = totalPrice + 1000;
  }

  const processOrder = async (orderType) => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("email");
      const { price, id, restaurant_id } = selectedItem;

      const paymentData = {
        email: userEmail,
        amount: totalPrice * 100,
        id,
        restaurantId: restaurant_id,
        orderType,
        location,
        quantity,
      };

      const { data } = await axios.post(
        `${REACT_APP_API_UR}/api/paystack/initialize`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Payment error:", err);
      setMessage("error initializing payment");
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (categoryId) => {
    if (categoryId === "All") {
      setFilteredMenu(menu);
    } else {
      const filteredItems = menu.filter(item => item.category_id === categoryId);
      setFilteredMenu(filteredItems);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {restaurant && (
        <>
          <section
            className="bg-cover bg-center relative w-full h-[450px]"
            style={{ backgroundImage: `url(${carousel3})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-start">
                <div className="lg:w-1/3 flex justify-center items-center lg:justify-start">
                  <img
                    src={`${REACT_APP_API_UR}/uploads/${restaurant.image_url}`}
                    alt={`${restaurant.name} logo`}
                    className="w-25 h-25 object-cover rounded-full border border-gray-300 shadow-sm"
                  />
                </div>
                <div className="text-left sm:item-center sm:justify-center text-white lg:w-2/3 lg:ml-6">
                  <h1 className="text-5xl font-extrabold mb-4 tracking-wider">{restaurant.name}</h1>
                  <p className="text-lg mb-6">{restaurant.description}</p>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500" />
                    <span className="text-white ml-2">{restaurant.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {message && (
            <MessageModal message={message} onClose={() => setMessage("")} />
          )}

          {showLogin && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <Login onSuccess={handleSuccess} onSwitchToRegister={() => setShowRegister(true)} />
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
                <Register onSuccess={handleSuccess} onSwitchToLogin={() => setShowLogin(true)} />
              </div>
            </div>
          )}

          <section className="container mx-auto px-6 py-16">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
                <h2 className="text-4xl font-semibold mb-8">Categories</h2>
                <ul>
                  <li
                    className="text-xl mb-4 cursor-pointer hover:text-blue-500"
                    onClick={() => filterByCategory("All")}
                  >
                    All
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className="text-xl mb-4 cursor-pointer hover:text-blue-500"
                      onClick={() => filterByCategory(category.id)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="container-fluid">
              <h1 className="fw-bold display-3 bg-gray">Menus</h1>
              <div className="row row-cols-2 row-cols-md-2 row-cols-lg-2 g-4">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="col mb-4"> {/* Added margin bottom for spacing */}
                    <div className="card h-100 shadow">
                      {/* Image section */}
                      <img
                        src={`${REACT_APP_API_UR}/uploads/${item.picture_url}`}
                        alt={item.name}
                        className="card-img-top"
                        style={{ height: "12rem", objectFit: "cover" }}
                      />

                      {/* Content section */}
                      <div className="card-body d-flex flex-column">
                        <h3 className="card-title fs-4 fw-semibold mb-2">{item.name}</h3>
                        <p className="card-text text-muted mb-4">{item.description}</p>

                        {/* Price and Button */}
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <p className="text-success fw-bold mb-0">₦{item.price}</p>
                          <button
                            onClick={() => handleOrderNow(item)}
                            className={`btn ${loading ? "btn-secondary disabled" : "btn-primary"}`}
                            disabled={loading}
                          >
                            {loading ? "Processing..." : "Order Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            </div>
          </section>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-semibold mb-4">Select Order Type</h3>
                <div className="flex justify-around mb-4">
                  <button
                    onClick={() => handleOrderTypeSelect('delivery')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => handleOrderTypeSelect('pickup')}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg"
                  >
                    Pickup
                  </button>
                </div>

                {orderType && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold">Quantity</label>
                      <div className="flex items-center justify-between">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded-lg"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </button>
                        <span className="mx-4">{quantity}</span>
                        <button
                          className="px-4 py-2 bg-gray-300 rounded-lg"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {orderType === 'delivery' && (
                      <div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold">Location</label>
                          <input
                            type="text"
                            placeholder="Enter delivery address"
                            className="w-full p-2 border rounded-lg"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <h2 className="text-md">Delivery price is ₦1000</h2>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-lg font-semibold">Total Price: ₦{totalPrice}</h4>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <button
                        onClick={handleConfirmOrder}
                        className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        {loading ? "Processing..." : "Confirm Order"}
                      </button>
                      <button
                        onClick={closeModal}
                        className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantPage;