const mongoose = require("mongoose");
const Spending = require("../models/Spending");
const Apartment = require("../models/Apartment");

// CREATE SPENDING
const createSpending = async (req, res) => {
  try {
    const {
      apartmentId,
      amount,
      date,
      category,
      description,
    } = req.body;

    if (!apartmentId || !amount || !date || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (!mongoose.isValidObjectId(apartmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid apartment ID.",
      });
    }

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found.",
      });
    }

    const spending = await Spending.create({
      apartment: apartmentId,
      amount,
      date,
      category,
      description,
    });

    const populatedSpending = await spending.populate(
      "apartment",
      "name"
    );

    res.status(201).json({
      success: true,
      message: "Spending created successfully.",
      spending: populatedSpending,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL SPENDINGS
const getSpendings = async (req, res) => {
  try {
    const spendings = await Spending.find()
      .populate("apartment", "name")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: spendings.length,
      spendings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SPENDINGS BY APARTMENT
const getSpendingsByApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;

    if (!mongoose.isValidObjectId(apartmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid apartment ID.",
      });
    }

    const spendings = await Spending.find({
      apartment: apartmentId,
    })
      .populate("apartment", "name")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: spendings.length,
      spendings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE SPENDING
const deleteSpending = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid spending ID.",
      });
    }

    const spending = await Spending.findByIdAndDelete(id);

    if (!spending) {
      return res.status(404).json({
        success: false,
        message: "Spending not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Spending deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createSpending,
  getSpendings,
  getSpendingsByApartment,
  deleteSpending,
};