import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../images/gt1.jpg";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import blessingegusi from "../images/blessingegusi.png";
import carousel2 from "../images/carousel2.jpg";
import pizza1 from "../images/foodbaker-special-pizza-1 (1).jpg";
import masonry8 from "../images/fb_masonary_8-1.jpg";

const Home = () => {
  const role = localStorage.getItem("role");
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);


  const navigate = useNavigate();

  const images = [carousel2, pizza1, masonry8];
  const [currentImage, setCurrentImage] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length); // Cycle through the images array
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, restaurantsResponse] = await Promise.all([
          axios.get(`http://localhost:3300/restaurant/menu`),
          axios.get(`http://localhost:3300/restaurant/profile`),
        ]);

        const menuItems = menuResponse.data;
        let restaurantList = restaurantsResponse.data;

        // Add random ratings to restaurants
        restaurantList = restaurantList.map((restaurant) => ({
          ...restaurant,
          rating: (Math.random() * 1 + 4).toFixed(1), 
          displayImage: images[Math.floor(Math.random() * images.length)],
        }));

        setFoodItems(menuItems);
        setRestaurants(restaurantList);
        setFilteredFoodItems(menuItems);
        setFilteredRestaurants(restaurantList);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFoodItems(foodItems);
      setFilteredRestaurants(restaurants);
    } else {
      const filteredFood = foodItems.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const filteredRest = restaurants.filter((restaurant) =>
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFoodItems(filteredFood);
      setFilteredRestaurants(filteredRest);
    }
  }, [searchTerm, foodItems, restaurants]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length); // Cycle through the images array
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

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
  

  const visitRestaurant = (restaurantId) => {
    navigate(`/restaurantpage/${restaurantId}`);
  };

  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };


  return (
    <div className="min-h-screen bg-gray-100">
    {/* Hero Section */}
    <div className="relative w-full" style={{
      backgroundImage: `url(${images[currentImage]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      height: '70vh',
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wider">
            Welcome
          </h1>
          <p className="text-lg mb-6 leading-relaxed">
            Explore your favorite dishes and place an order today!
          </p>
          {role === "restaurant" && (
            <button
              onClick={handleNavigateToDashboard}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>




      {/* users */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex items-center text-gray-700">
          <i className="fa fa-check-circle text-blue-500 mr-2 text-2xl"></i>
          <span>18 Restaurants</span>
        </div>
        <div className="flex items-center text-gray-700">
          <i className="fa fa-check-circle text-blue-500 mr-2 text-2xl"></i>
          <span>52 People Served</span>
        </div>
        <div className="flex items-center text-gray-700">
          <i className="fa fa-check-circle text-blue-500 mr-2 text-2xl"></i>
          <span>51 Registered Users</span>
        </div>
      </div>
    </div>

      {/* how it works */}
      <section className="text-center py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-500 mb-8">
          Explore how easy it is to place your order with us.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-full sm:w-1/3 lg:w-1/4 hover:scale-105 transform transition duration-300">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="icon text-4xl text-blue-500 mb-4">
                <i className="fas fa-university"></i>
              </div>
              <h5 className="text-xl font-semibold mb-4">Choose A Restaurant</h5>
              <p className="text-gray-700">
                Find your favorite restaurant from a list of top picks.
              </p>
            </div>
            </div>
            <div className="w-full sm:w-1/3 lg:w-1/4">
              <div className="how-it-works-item bg-white p-6 rounded-lg shadow-md">
                <div className="icon text-4xl text-orange-500 mb-4">
                  <i className="fas fa-hamburger"></i>
                </div>
                <h5 className="text-xl font-semibold mb-4">Choose A Tasty Dish</h5>
                <p className="text-gray-700">
                  Dictum velit. Duis at purus enim. Cras massa massa, maximus sit amet finibus quis, pharetra eu erat.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/3 lg:w-1/4">
              <div className="how-it-works-item bg-white p-6 rounded-lg shadow-md">
                <div className="icon text-4xl text-green-500 mb-4">
                  <i className="fas fa-truck"></i>
                </div>
                <h5 className="text-xl font-semibold mb-4">Pick Up Or Delivery</h5>
                <p className="text-gray-700">
                  Purus enim. Cras massa massa, maximus sit amet finibus quis, pharetra eu erat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Search Bar */}
      <section className="container mx-auto px-6 py-8">
        <h2 className="text-4xl font-semibold text-center mb-6">
          Search for Your Favorite Dish
        </h2>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Search food items"
          />
        </div>
      </section>


      {/* Food Items Section */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-lg shadow-lg">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Our Popular Dishes
        </h2>
        {filteredFoodItems.length > 0 ? (
          <div className="flex overflow-x-auto space-x-8 py-4">
            {filteredFoodItems.map((item) => {
              
              const restaurant = filteredRestaurants.find(
                (rest) => rest.user_id === item.restaurant_id
              );
              
              return (
                <div
                  key={item.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-shrink-0 w-80 flex-col max-h-[450px]" // max height adjusted
                >
                  {/* Food Image */}
                  <img
                    src={`http://localhost:3300/uploads/${item.picture_url}`}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />

                  {/* Content Section */}
                  <div className="flex flex-col p-4 flex-grow justify-between">
                    <div className="flex flex-col mb-3"> {/* Reduced margin */}
                      {/* Food Name */}
                      <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {item.description || "No description available for this dish."}
                      </p>

                      {/* Restaurant Info */}
                      <div className="flex items-center mb-3"> {/* Reduced margin */}
                        {/* Restaurant Logo */}
                        <img
                          src={`http://localhost:3300/uploads/${restaurant?.image_url}`}
                          alt={`${restaurant?.name} logo`}
                          className="w-10 h-10 object-cover rounded-full border border-gray-300 shadow-sm"
                        />
                        <div className="ml-3">
                          {/* Restaurant Name */}
                          <span className="font-semibold text-gray-700">
                            {restaurant?.name}
                          </span>
                          {/* Restaurant Address */}
                          <p className="text-gray-500 text-sm">{restaurant?.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price and Order Button */}
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-green-600 font-bold text-lg">
                        ₦{item.price}
                      </p>

                      {/* Order Now Button */}
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
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No food items match your search.
          </p>
        )}
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

      {/* Popular Restaurants Section */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-lg shadow-lg">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Discover Popular Restaurants
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the finest dining spots around you! Whether you're craving local favorites or international cuisines, we've got you covered. Dive into our selection of top-rated restaurants and order your favorite meals in just a few clicks.
          </p>
        </div>
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Restaurant Display Image */}
                <img
                  src={restaurant.displayImage}
                  alt={restaurant.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6 bg-gray-50 flex flex-col flex-grow">
                  {/* Restaurant Name */}
                  <h3 className="text-2xl font-bold text-gray-800 truncate bg-blue-50 rounded-md px-2 py-1 mb-4">
                    {restaurant.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {restaurant.description || "No description available for this restaurant."}
                  </p>

                  {/* Footer: Logo, Address, Time, Order Now */}
                  <div className="flex items-center justify-between mt-auto bg-gray-100 p-3 rounded-md">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                      <img
                        src={`http://localhost:3300/uploads/${restaurant.image_url}`}
                        alt={`${restaurant.name} logo`}
                        className="w-10 h-10 object-cover rounded-full border border-gray-300 shadow-sm"
                      />
                      {/* Address */}
                      <span className="text-sm text-gray-600 truncate max-w-[150px]">
                        {restaurant.address}
                      </span>
                    </div>

                    {/* Delivery Time */}
                    <span className="text-sm text-gray-500 font-medium">
                      10 min
                    </span>

                    {/* Order Button */}
                    <button
                      onClick={() => visitRestaurant(restaurant.user_id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 text-sm font-semibold shadow-md"
                    >
                      Check out
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No restaurants match your search.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
