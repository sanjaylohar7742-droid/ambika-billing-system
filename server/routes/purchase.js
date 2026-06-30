const express = require("express");
const {
  createPurchase,
  getPurchases,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", createPurchase);
router.get("/", getPurchases);

module.exports = router;