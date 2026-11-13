
const express = require("express");

const {
  getMonthlyCharges,
  saveMonthlyCharge,
} = require("../controllers/monthlyChargeController");

const router = express.Router();

// Get charges by month and year
router.get("/", getMonthlyCharges);

// Add or update monthly charges
router.post("/", saveMonthlyCharge);

module.exports = router;
