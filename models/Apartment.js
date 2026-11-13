const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rent: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    water: {
      type: Number,
      default: 0,
      min: 0,
    },

    garbage: {
      type: Number,
      default: 0,
      min: 0,
    },

    service: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;