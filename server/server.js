require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); 
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const saleRoutes = require("./routes/sale");
const purchaseRoutes = require("./routes/purchase");
const dashboardRoutes = require("./routes/dashboard");
const uploadRoutes = require("./routes/upload");

dotenv.config(); 

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Ambika Billing & Inventory Backend Running Successfully 🚀"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});