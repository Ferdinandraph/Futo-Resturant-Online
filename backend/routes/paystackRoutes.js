const express = require("express");
const crypto = require("crypto");
const {
    initializePayment,
    verifyPayment,
    fetchTransaction,
    webhookHandler,
    getPaymentDetails,
    savePaymentDetails,
} = require("../controllers/paystackController");
const { requireRestaurantAuth, requireCustomerAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. Customers initialize payment
router.post("/initialize", requireCustomerAuth, initializePayment);

// 2. Customers verify payment after completing the transaction
router.get("/verify/:reference", requireCustomerAuth,  verifyPayment);

// 3. Restaurant payment details and subaccount creation
router.get("/payment/:restaurantId", requireRestaurantAuth, getPaymentDetails);
router.post("/payment", requireRestaurantAuth, savePaymentDetails);

// 4. Restaurants fetch transaction details for orders they received
router.get("/transaction/:transactionId", requireRestaurantAuth, fetchTransaction);

// 5. Webhook for handling payment updates
router.post("/webhook", express.json(), webhookHandler); // Using express.json to parse Paystack's webhook payload

module.exports = router;
