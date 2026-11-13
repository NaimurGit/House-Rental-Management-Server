const express = require("express");

const {
  createPayment,
  getPayments,
  getPaymentsByApartment,
  deletePayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Create payment
router.post("/", createPayment);

// Get all payments
router.get("/", getPayments);

// Get payments by apartment
router.get("/apartment/:apartmentId", getPaymentsByApartment);

// Delete payment
router.delete("/:id", deletePayment);

module.exports = router;