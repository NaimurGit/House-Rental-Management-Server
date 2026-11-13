
const mongoose = require("mongoose");
const Apartment = require("../models/Apartment");
const MonthlyCharge = require("../models/MonthlyCharge");

// =====================================
// VALIDATE MONTH AND YEAR
// =====================================

const validateMonthYear = (month, year) => {
  return (
    Number.isInteger(Number(month)) &&
    Number(month) >= 0 &&
    Number(month) <= 11 &&
    Number.isInteger(Number(year)) &&
    Number(year) >= 2000
  );
};

// =====================================
// GET MONTHLY CHARGES
// =====================================

const getMonthlyCharges = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!validateMonthYear(month, year)) {
      return res.status(400).json({
        success: false,
        message: "Valid month and year are required.",
      });
    }

    const selectedMonth = Number(month);
    const selectedYear = Number(year);

    // Get all apartments
    const apartments = await Apartment.find().sort({
      createdAt: -1,
    });

    // Get charges for the selected month
    const charges = await MonthlyCharge.find({
      month: selectedMonth,
      year: selectedYear,
    });

    // Get all charges from previous months
    const previousCharges = await MonthlyCharge.find({
      $or: [
        {
          year: { $lt: selectedYear },
        },
        {
          year: selectedYear,
          month: { $lt: selectedMonth },
        },
      ],
    });

    // Attach monthly charges to every apartment
    const monthlyCharges = apartments.map((apartment) => {
      // Find selected month's charge
      const charge = charges.find(
        (item) =>
          item.apartment.toString() === apartment._id.toString()
      );

      // Calculate all previous monthly charges
      const apartmentPreviousCharges = previousCharges
        .filter(
          (item) =>
            item.apartment.toString() === apartment._id.toString()
        )
        .reduce(
          (sum, item) =>
            sum +
            Number(item.rent || 0) +
            Number(item.water || 0) +
            Number(item.garbage || 0) +
            Number(item.service || 0),
          0
        );

      return {
        apartmentId: apartment._id,
        apartmentName: apartment.name,

        month: selectedMonth,
        year: selectedYear,

        // Selected month's charges
        rent: charge?.rent ?? 0,
        water: charge?.water ?? 0,
        garbage: charge?.garbage ?? 0,
        service: charge?.service ?? 0,

        // Total charges from previous months
        previousCharges: apartmentPreviousCharges,

        chargeId: charge?._id ?? null,
      };
    });

    return res.status(200).json({
      success: true,
      month: selectedMonth,
      year: selectedYear,
      monthlyCharges,
    });
  } catch (error) {
    console.error("Get monthly charges error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// ADD OR UPDATE MONTHLY CHARGES
// =====================================

const saveMonthlyCharge = async (req, res) => {
  try {
    const {
      apartmentId,
      month,
      year,
      rent,
      water,
      garbage,
      service,
    } = req.body;

    // Validate apartment ID, month and year
    if (
      !apartmentId ||
      !mongoose.isValidObjectId(apartmentId) ||
      !validateMonthYear(month, year)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid apartment, month and year are required.",
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

    // Validate charge amounts
    const chargeValues = {
      rent,
      water,
      garbage,
      service,
    };

    for (const [key, value] of Object.entries(chargeValues)) {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Valid ${key} amount is required.`,
        });
      }
    }

    // Add or update the apartment's monthly charge
    const monthlyCharge = await MonthlyCharge.findOneAndUpdate(
      {
        apartment: apartmentId,
        month: Number(month),
        year: Number(year),
      },
      {
        $set: {
          rent: Number(rent),
          water: Number(water),
          garbage: Number(garbage),
          service: Number(service),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Monthly charges saved successfully.",
      monthlyCharge,
    });
  } catch (error) {
    console.error("Save monthly charge error:", error);

    // Handle duplicate apartment/month/year records
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Monthly charges already exist for this apartment and month.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {
  getMonthlyCharges,
  saveMonthlyCharge,
};
