
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      required: true,
    },

    method: {
      type: String,
      required: true,
      enum: [
        "Cash",
        "Bank Transfer",
        "bKash",
        "Nagad",
        "Rocket",
      ],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
