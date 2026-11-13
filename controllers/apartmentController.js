const Apartment = require("../models/Apartment");

// CREATE APARTMENT
const createApartment = async (req, res) => {
    console.log("CREATE APARTMENT CONTROLLER REACHED");
    console.log("REQUEST BODY:", req.body);
    try {
        const apartment = await Apartment.create(req.body);

        res.status(201).json({
            success: true,
            message: "Apartment created successfully",
            apartment,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// GET ALL APARTMENTS
const getApartments = async (req, res) => {
    try {
        const apartments = await Apartment.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            apartments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET SINGLE APARTMENT
const getApartmentById = async (req, res) => {
    try {
        const apartment = await Apartment.findById(req.params.id);

        if (!apartment) {
            return res.status(404).json({
                success: false,
                message: "Apartment not found",
            });
        }

        res.status(200).json({
            success: true,
            apartment,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE APARTMENT
const updateApartment = async (req, res) => {
    try {
        const apartment = await Apartment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!apartment) {
            return res.status(404).json({
                success: false,
                message: "Apartment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Apartment updated successfully",
            apartment,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE APARTMENT
const deleteApartment = async (req, res) => {
    try {
        const apartment = await Apartment.findByIdAndDelete(req.params.id);

        if (!apartment) {
            return res.status(404).json({
                success: false,
                message: "Apartment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Apartment deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createApartment,
    getApartments,
    getApartmentById,
    updateApartment,
    deleteApartment,
};