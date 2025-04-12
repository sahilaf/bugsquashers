// routes/retailerOrderRoutes.js
const express = require("express");
const RetailerOrder = require("../models/retailerOrderModel");

const router = express.Router();

// Fetch all retailer orders
router.get("/", async (req, res) => {
  try {
    const orders = await RetailerOrder.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch retailer orders" });
  }
});

// Add a new retailer order
router.post("/", async (req, res) => {
  try {
    const { product, category, quantity, price } = req.body;
    // Calculate total
    const priceNum = parseFloat(price.replace("$", ""));
    const total = `$${(quantity * priceNum).toFixed(2)}`;
    const newOrder = new RetailerOrder({ ...req.body, total });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to add retailer order" });
  }
});

// Update retailer order
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await RetailerOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update retailer order" });
  }
});

// Delete a retailer order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await RetailerOrder.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Retailer order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete retailer order" });
  }
});

module.exports = router;