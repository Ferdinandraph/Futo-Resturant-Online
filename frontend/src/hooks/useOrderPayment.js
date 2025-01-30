import { useState } from "react";
import axios from "axios";

const useOrderPayment = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrderNow = (item) => {
    setSelectedItem(item); // Store the selected item
    setShowModal(true); // Show the modal for order type selection
  };

  const handleOrderTypeSelect = (type) => {
    setOrderType(type); // Set the order type
    setShowModal(false); // Close the modal
    processOrder(type); // Process the order after selecting order type
  };

  const processOrder = async (orderType) => {
    if (!selectedItem) return; // Prevent further processing if no item is selected

    try {
      setLoading(true); // Set loading state to true while processing the order
      const userEmail = localStorage.getItem("email");
      const { price, id, restaurant_id } = selectedItem; // Get item details

      const paymentData = {
        email: userEmail,
        amount: price * 100, // Convert to kobo
        id,
        restaurantId: restaurant_id,
        orderType: orderType,
      };

      // Initialize Payment
      const { data } = await axios.post(
        "http://0.0.0.0:1000/api/paystack/initialize",
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

  return {
    selectedItem,
    orderType,
    showModal,
    loading,
    handleOrderNow,
    handleOrderTypeSelect,
  };
};

export default useOrderPayment;
