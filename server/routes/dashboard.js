const express = require("express");
const Sale = require("../models/sale");
const Purchase = require("../models/purchase");
const Product = require("../models/Product");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const sales = await Sale.find();
    const purchases = await Purchase.find();

    const totalSales = sales.length;
    const totalPurchases = purchases.length;

    const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.totalAmount ?? s.amount ?? 0) || 0), 0);
    const totalPaid = purchases.reduce((sum, p) => sum + (Number(p.totalAmount ?? p.amount ?? 0) || 0), 0);

    const gstCollected = sales.reduce((sum, s) => {
      const amount = Number(s.totalAmount ?? s.amount ?? 0) || 0;
      const gstValue = typeof s.gst === "number"
        ? s.gst
        : Number.isFinite(Number(s.gst))
          ? Number(s.gst)
          : 0;
      return sum + (gstValue > 0 ? (amount * gstValue) / 100 : 0);
    }, 0);

    const netProfit = totalRevenue - totalPaid;

    const monthlySummary = {};

    sales.forEach((s) => {
      const d = new Date(s.createdAt || s.date);
      const key = `${d.getMonth() + 1}-${d.getFullYear()}`;

      if (!monthlySummary[key]) {
        monthlySummary[key] = { month: key, sales: 0, purchases: 0, profit: 0 };
      }

      monthlySummary[key].sales += s.amount || 0;
    });

    purchases.forEach((p) => {
      const d = new Date(p.createdAt || p.date);
      const key = `${d.getMonth() + 1}-${d.getFullYear()}`;

      if (!monthlySummary[key]) {
        monthlySummary[key] = { month: key, sales: 0, purchases: 0, profit: 0 };
      }

      monthlySummary[key].purchases += p.amount || 0;
    });

    Object.keys(monthlySummary).forEach((key) => {
      monthlySummary[key].profit =
        monthlySummary[key].sales - monthlySummary[key].purchases;
    });

    res.json({
      totalProducts: products,
      totalSales,
      totalPurchases,
      totalRevenue,
      totalPaid,
      gstCollected,
      netProfit,
      monthlySummary: Object.values(monthlySummary),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/reset", async (req, res) => {
  try {
    await Sale.deleteMany({});
    await Purchase.deleteMany({});
    await Product.deleteMany({});

    res.json({ message: "All sales, purchases, and products cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;