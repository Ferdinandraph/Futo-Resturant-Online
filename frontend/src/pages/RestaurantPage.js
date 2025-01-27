import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import axios from "axios";
import carousel3 from '../images/carousel3.jpg'


const RestaurantPage = () => {
  const [restaurant, setRestaurant] = useState([]);
  const { restaurantId }  = useParams()
  const [orderType, setOrderType] = useState(""); // Store order type
  const [showModal, setShowModal] = useState(false); // Control the visibility of the modal
  const [menu, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default to 1 item
  const [location, setLocation] = useState(""); // Default location is empty
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const restaurantData = async () => {
        try {
            const restaurantResponse = await axios.get(`http://localhost:3300/restaurant/profile/${restaurantId}`);
            const restaurant = restaurantResponse.data;
            if (!restaurant) {
                console.log("restaurant is undefined")
            }
            setRestaurant(restaurant.profile)
        } catch (err) {
            console.error('error while fetching restaurant:', err)
        }
    }

    const menuData = async () => {
        try {
            const menuResponse = await axios.get(`http://localhost:3300/restaurant/menu/${restaurantId}`)
            const menu = menuResponse.data;
            console.log(menu)
            setMenu(menu)
        } catch (err) {
            console.error('error fetching menus:', err)
        }
        restaurantData()

    }
    menuData()
  }, [restaurantId]);

  const handleOrderNow = (item) => {
    setSelectedItem(item); // Store the selected item
    setShowModal(true); // Show the modal for order type selection
  };

  const handleOrderTypeSelect = (type) => {
    setOrderType(type); // Set the order type
  };
  
  const handleConfirmOrder = () => {
    if (!quantity || (orderType === "delivery" && !location)) {
      alert("Please fill in all required fields.");
      return;
    }
    
    processOrder(orderType); // Proceed with the order
    setShowModal(false)
  };
  const totalPrice = selectedItem? selectedItem.price * quantity: 0
  
  const processOrder = async (orderType) => {
    try {
      setLoading(true); // Set loading state to true while processing the order
      const userEmail = localStorage.getItem("email");
      const { price, id, restaurant_id } = selectedItem; // Get item details
  
      const paymentData = {
        email: userEmail,
        amount: totalPrice * 100, // Multiply price by quantity
        id,
        restaurantId: restaurant_id,
        orderType,
        location, // Add location for delivery orders
        quantity, // Include quantity in the payment data
      };
  
      // Initialize Payment
      const { data } = await axios.post(
        "http://localhost:3300/api/paystack/initialize",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Redirect to Paystack Payment URL
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Error initializing payment. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {restaurant && (
        <>
          {/* Restaurant Details Section */}
          <section
            className="bg-cover bg-center relative w-full h-[450px]"
            style={{ backgroundImage: `url(${carousel3})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-start">
                {/* Left Content (Image) */}
                <div className="lg:w-1/3 flex justify-center items-center lg:justify-start">
                  <img
                    src={restaurant.image}
                    alt={`${restaurant.name}`}
                    className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                  />
                </div>
                {/* Right Content (Text) */}
                <div className="text-left text-white lg:w-2/3 lg:ml-6">
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



          {/* Menu Section */}
          <section className="container mx-auto px-6 py-16">
            <h2 className="text-4xl font-semibold text-center mb-8">Explore Our Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {menu.map((item) => (
                <div key={item.id} className="bg-white shadow-xl rounded-lg overflow-hidden">
                  <img src={`http://localhost:3300/uploads/${item.picture_url}`} alt={item.name} className="h-56 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold">{item.name}</h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                    <p className="text-green-600 font-bold mt-4">₦{item.price}</p>
                    <button
                        onClick={() => handleOrderNow(item)}
                        className={`${
                          loading
                            ? "bg-gray-300 text-gray-500"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        } px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 text-sm font-semibold`}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Order Now"}
                  </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/** show modal for order */}
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
                  )}

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">Total Price: ₦{totalPrice}</h4>
                  </div>

                  <button
                    onClick={handleConfirmOrder}
                    className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Confirm Order"}
                  </button>
                </>
              )}
            </div>
          </div>
        )
      }
        </>
      )}
    </div>
  );
};

export default RestaurantPage;
