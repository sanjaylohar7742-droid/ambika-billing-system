const express = require("express");
const { createSale, getSales } = require("../controllers/saleController");

const router = express.Router();
// Create Sale
router.post("/", createSale);
// Get All Sales
router.get("/", getSales);

module.exports = router;