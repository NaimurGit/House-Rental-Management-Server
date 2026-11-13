const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const apartmentRoutes = require("./routes/apartmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const spendingRoutes = require("./routes/spendingRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("House Rent Management API is Running");
});

// Apartment routes
app.use("/api/apartments", apartmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/spendings", spendingRoutes);

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