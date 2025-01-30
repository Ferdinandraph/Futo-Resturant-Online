require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const paystackRoutes = require('./routes/paystackRoutes')

const app = express();
const PORT = process.env.PORT || 1000;

// Enable CORS
app.use(cors({ origin: "http://localhost:3000" }));

// Middleware for parsing JSON
app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/restaurant", restaurantRoutes);

// Serve static files
app.use('/uploads', express.static('C:/Users/USER/Documents/Futo-Resturant-Online/backend/uploads'));

app.use("/api/paystack", paystackRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.params);
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
