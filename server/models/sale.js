const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    gst: {
      type: Number,
      default: 0,
    },

    customerName: {
      type: String,
      default: "Walk-in Customer",
    }
    ,customerGST: {
    type: String,
    default: ""
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", saleSchema);