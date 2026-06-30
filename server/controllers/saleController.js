const Sale = require("../models/sale");
const Product = require("../models/product");

// Create Sale
const createSale = async (req, res) => {
  try {
    const { productId, quantity, customerName, customerGST, gst } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const totalAmount = product.price * quantity;

    product.stock = product.stock - quantity;
    await product.save();

    const sale = await Sale.create({
      product: productId,
      quantity,
      totalAmount,
      gst: Number(gst || 0),
      customerName,
      customerGST,
    });

    res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("product").sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSale, getSales };
