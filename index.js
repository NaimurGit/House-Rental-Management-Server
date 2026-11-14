
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const apartmentRoutes = require("./routes/apartmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const spendingRoutes = require("./routes/spendingRoutes");
const monthlyChargeRoutes = require("./routes/monthlyChargeRoutes");
const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("House Rent Management API is Running");
});

// Public authentication route
app.use("/api/auth", authRoutes);

// Protected application routes
app.use("/api/apartments", authMiddleware, apartmentRoutes);
app.use("/api/payments", authMiddleware, paymentRoutes);
app.use("/api/spendings", authMiddleware, spendingRoutes);
app.use("/api/monthly-charges", authMiddleware, monthlyChargeRoutes);

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
