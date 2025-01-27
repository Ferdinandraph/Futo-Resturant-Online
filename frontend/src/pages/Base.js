import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../images/gt1.jpg";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const Base = () => {

  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, restaurantsResponse] = await Promise.all([
          axios.get(`http://localhost:3300/restaurant/menu`),
          axios.get(`http://localhost:3300/restaurant/profile`),
        ]);
        const menuItems = menuResponse.data;
        const restaurantList = restaurantsResponse.data;
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

  const handleOrderNow = (restaurantId) => {
    navigate(`/restaurantpage/${restaurantId}`)
  };


  console.log(filteredRestaurants)
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div
        className="relative w-full h-[450px] bg-cover bg-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-6xl font-extrabold mb-4 tracking-wider">
            </h1>
            <p className="text-lg mb-6">
              Explore your favorite dishes and place an order today!
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <section className="container mx-auto px-6 py-8">
        <h2 className="text-4xl font-semibold text-center mb-6">
          Search for Your Favorite Dish and Restaurants
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
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold text-center mb-8">Our Popular Dishes</h2>
        {filteredFoodItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredFoodItems.map((item) => {
              return (
                <div key={item.id} className="bg-white shadow-xl rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold">{item.name}</h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                    <p className="text-green-600 font-bold mt-4">₦{item.price}</p>
                    <button
                      onClick={() => handleOrderNow(item.restaurant_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">No food items match your search.</p>
        )}
</section>


      {/* Popular Restaurants Section */}
      <section className="container mx-auto px-6 py-16 bg-gray-200 rounded-lg">
        <h2 className="text-4xl font-semibold text-center mb-8">Restaurants</h2>
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white shadow-xl rounded-lg overflow-hidden">
              <img
                  src={`http://localhost:3300/uploads/${restaurant.image_url}`}
                  alt={restaurant.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
                  <div className="flex items-center mt-2">
                    <FaStar className="text-yellow-500" />
                    <span className="text-gray-600 ml-2">
                      {restaurant.rating ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No restaurants match your search.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8">
              <h3 className="text-lg font-bold mb-4">About FF-Tech</h3>
              <p>
                We provide the best food delivery service in town, ensuring fresh, healthy, and delicious meals are at your doorstep!
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-8">
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer">About Us</li>
                <li className="hover:underline cursor-pointer">Contact</li>
                <li className="hover:underline cursor-pointer">Restaurants</li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
              <p>Email: info@FF-Tech.com</p>
              <p>Phone: +1 234 567 890</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p>© 2025 FF-Tech. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Base;
