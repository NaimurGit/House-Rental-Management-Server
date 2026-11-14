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

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Ensure a (cached) database connection exists for every request.
// This is required on serverless platforms like Vercel, where the
// process is started fresh and never runs app.listen().
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// Export the app for serverless platforms (Vercel)
module.exports = app;

// Only start a listener when running the server directly (local dev)
if (require.main === module) {
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
}
