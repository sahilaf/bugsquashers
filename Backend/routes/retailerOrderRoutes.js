const express = require("express");
const RetailerOrder = require("../models/retailerOrderModel");
const router = express.Router();

// Fetch all retailer orders
router.get("/", async (req, res) => {
  try {
    const orders = await RetailerOrder.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching retailer orders:", error);
    res.status(500).json({ error: "Failed to fetch retailer orders" });
  }
});

// Add a new retailer order
router.post("/", async (req, res) => {
  try {
    const { quantity, price } = req.body;

    // Ensure price is in correct format
    const priceNum = parseFloat(price.replace("$", ""));
    if (isNaN(priceNum)) {
      return res.status(400).json({ error: "Invalid price format" });
    }

    // Calculate total
    const total = `$${(quantity * priceNum).toFixed(2)}`;

    // Create and save the new order
    const newOrder = new RetailerOrder({ ...req.body, total });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error adding retailer order:", error);
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
    console.error("Error updating retailer order:", error);
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
    console.error("Error deleting retailer order:", error);
    res.status(500).json({ error: "Failed to delete retailer order" });
  }
});

module.exports = router;
