require("dotenv").config();
const path = require('path');
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const paystackRoutes = require('./routes/paystackRoutes')

const app = express();
const PORT = process.env.PORT || 10000;

const corsOptions = {
  origin: ["https://futo-resturant-online-2-h25e.onrender.com", "http://localhost:3000"], // Fix syntax (split into array properly)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// Enable CORS
app.use(cors( corsOptions));

// Middleware for parsing JSON
app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/restaurant", restaurantRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
