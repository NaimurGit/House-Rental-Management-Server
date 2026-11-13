
const mongoose = require("mongoose");

const monthlyChargeSchema = new mongoose.Schema(
  {
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 0,
      max: 11,
    },

    year: {
      type: Number,
      required: true,
    },

    rent: {
      type: Number,
      default: 0,
      min: 0,
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
  { timestamps: true }
);

monthlyChargeSchema.index(
  { apartment: 1, month: 1, year: 1 },
  { unique: true }
);

const MonthlyCharge = mongoose.model(
  "MonthlyCharge",
  monthlyChargeSchema
);

module.exports = MonthlyCharge;
