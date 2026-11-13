const express = require("express");

const {
  createApartment,
  getApartments,
  getApartmentById,
  updateApartment,
  deleteApartment,
} = require("../controllers/apartmentController");

const router = express.Router();

router.post("/", createApartment);
router.get("/", getApartments);
router.get("/:id", getApartmentById);
router.put("/:id", updateApartment);
router.delete("/:id", deleteApartment);

module.exports = router;