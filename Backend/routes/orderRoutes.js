const express = require("express");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

const router = express.Router();

// Error handler middleware (could be moved to a separate file)
const handleError = (error, res) => {
  console.error(error); // Log the error for debugging
  
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  
  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: "Duplicate key error" });
  }
  
  // Default to 500 server error
  res.status(500).json({ 
    error: "An unexpected error occurred",
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    handleError(error, res);
  }
});

// Add a new order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    handleError(error, res);
  }
});

// Update order status
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;