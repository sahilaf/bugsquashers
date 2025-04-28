const express = require("express");
const mongoose = require("mongoose");
const CustomerOrder = require("../models/customerOrderModel");
const CartItem = require("../models/Cart");
const Shop = require("../models/shopModel"); // Import Shop model
const admin = require("../config/firebase"); // Firebase Admin SDK

const router = express.Router();

// Error Handler
const handleError = (error, res) => {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: "Duplicate key error" });
  }

  res.status(500).json({
    error: "An unexpected error occurred",
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Utility: calculate total
const calculateTotal = (cartItems) => {
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.productId.price * item.quantity);
  }, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return total.toFixed(2);
};

// Utility: get Shop Name by ID
const getShopNameById = async (shopId) => {
  try {
    const shop = await Shop.findById(shopId).select('name');
    if (!shop) {
      throw new Error('Shop not found');
    }
    return shop.name;
  } catch (error) {
    console.error("Error fetching shop name:", error.message);
    throw error;
  }
};

// Get all orders (admin)
router.get("/", async (req, res) => {
  try {
    const orders = await CustomerOrder.find();
    res.json(orders);
  } catch (error) {
    handleError(error, res);
  }
});

// Create order
router.post("/create", async (req, res) => {
  try {
    const { cartItems, customer } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check Firebase token manually
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    let decodedUser;
    try {
      decodedUser = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decodedUser.uid; // Firebase UID

    const firstProduct = cartItems[0].productId;

    // Fetch shop name using shop ID
    const shopName = await getShopNameById(firstProduct.shop);

    const order = new CustomerOrder({
      orderId: `ORDER-${Date.now()}`,
      customerId: userId,
      createdBy: userId,
      shopId: firstProduct.shop,
      shopName: shopName, // Use fetched shop name
      items: cartItems.map(item => ({
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      total: calculateTotal(cartItems),
      payment: "Paid",
      status: "Processing",
      shippingInfo: customer,
    });

    await order.save();

    await CartItem.deleteMany({ user: userId });

    // Add this population to ensure fresh data
    const updatedCart = await CartItem.find({ user: userId })
      .populate({
        path: 'productId',
        populate: { path: 'shop' }
      });

    res.status(201).json({
      success: true,
      orderId: order.orderId,
      total: order.total,
      cart: updatedCart // Send back empty cart for verification
    });

  } catch (error) {
    handleError(error, res);
  }
});

// Get single order
router.get("/:orderId", async (req, res) => {
  try {
    const order = await CustomerOrder.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
