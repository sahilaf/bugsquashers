const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");

// POST /api/cart - Add item to cart
router.post("/cart", async (req, res) => {
  try {
    const { userId, cropId, quantity } = req.body;

    // Validate required fields we can add more categorization but complexing the database relation 
    if (!userId || !cropId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if cart exists for user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if crop already in cart
    const itemIndex = cart.items.findIndex(item => item.cropId.toString() === cropId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ cropId, quantity });
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
});

//  GET /api/cart/:userId - Fetch cart for a user
router.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.cropId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
});

//  DELETE /api/cart/:userId/item/:cropId - Remove item from cart
router.delete("/cart/:userId/item/:cropId", async (req, res) => {
  try {
    const { userId, cropId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(cropId)) {
      return res.status(400).json({ message: "Invalid user ID or crop ID" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.cropId.toString() !== cropId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    res.status(500).json({ message: "Failed to remove item from cart", error: error.message });
  }
});

module.exports = router;