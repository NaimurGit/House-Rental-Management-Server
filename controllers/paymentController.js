const mongoose = require("mongoose");

const Payment = require("../models/Payment");
const Apartment = require("../models/Apartment");

// =====================================
// CREATE PAYMENT
// =====================================

const createPayment = async (req, res) => {
  try {
    const { apartmentId, amount, date, method, description } = req.body;

    // Validate required fields
    if (!apartmentId || !amount || !date || !method) {
      return res.status(400).json({
        success: false,
        message: "Apartment, amount, date and payment method are required.",
      });
    }

    // Validate apartment ID
    if (!mongoose.isValidObjectId(apartmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid apartment ID.",
      });
    }

    // Check whether apartment exists
    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found.",
      });
    }

    // Create payment
    const payment = await Payment.create({
      apartment: apartmentId,
      amount: Number(amount),
      date,
      method,
      description,
    });

    // Return created payment with apartment information
    const populatedPayment = await Payment.findById(payment._id)
      .populate("apartment", "name");

    res.status(201).json({
      success: true,
      message: "Payment created successfully.",
      payment: populatedPayment,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET ALL PAYMENTS
// =====================================

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("apartment", "name")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET PAYMENTS BY APARTMENT
// =====================================

const getPaymentsByApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;

    if (!mongoose.isValidObjectId(apartmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid apartment ID.",
      });
    }

    const payments = await Payment.find({
      apartment: apartmentId,
    })
      .populate("apartment", "name")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// DELETE PAYMENT
// =====================================

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID.",
      });
    }

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentsByApartment,
  deletePayment,
};