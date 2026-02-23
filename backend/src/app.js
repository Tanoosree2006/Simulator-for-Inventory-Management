const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Inventory Concurrency Simulator API is running");
});

app.get("/health", (req, res) => res.send("OK"));

module.exports = app;