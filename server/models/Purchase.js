const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);