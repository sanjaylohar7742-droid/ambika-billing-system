const express = require("express");
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

// Add Product
router.post("/", addProduct);

// Get All Products
router.get("/", getProducts);

router.put("/:id", updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);


module.exports = router;