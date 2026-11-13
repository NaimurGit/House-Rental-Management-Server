const express = require("express");

const {
  createSpending,
  getSpendings,
  getSpendingsByApartment,
  deleteSpending,
} = require("../controllers/spendingController");

const router = express.Router();

router.post("/", createSpending);
router.get("/", getSpendings);
router.get("/apartment/:apartmentId", getSpendingsByApartment);
router.delete("/:id", deleteSpending);

module.exports = router;