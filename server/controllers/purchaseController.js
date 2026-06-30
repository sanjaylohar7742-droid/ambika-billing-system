const Purchase = require("../models/purchase");
const Product = require("../models/product");
// Add Purchase
const createPurchase = async (req, res) => {

    try {

        const {
            supplierName,
            productId,
            quantity,
            totalAmount
        } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Stock Increase
        product.stock += Number(quantity);

        await product.save();

        const purchase = await Purchase.create({
            supplierName,
            product: productId,
            quantity,
            totalAmount
        });

        res.status(201).json(purchase);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Purchases
const getPurchases = async (req, res) => {

    const purchases =
        await Purchase.find()
        .populate("product")
        .sort({ createdAt: -1 });

    res.json(purchases);
};

module.exports = {
    createPurchase,
    getPurchases
};