const express = require("express");
const mongoose = require("mongoose");
const { body, param, validationResult } = require("express-validator");
const CustomerOrder = require("../models/customerOrderModel");
const RetailerOrder = require("../models/retailerOrderModel");

const router = express.Router();

// Generate unique order ID
const generateOrderId = async () => {
  const count = await CustomerOrder.countDocuments();
  return `CUST${String(count + 1).padStart(3, "0")}`;
};

// Input sanitization and validation middleware
const validateObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

const sanitizeObjectId = (value) => {
  return mongoose.Types.ObjectId(value);
};
// Fetch all customer orders (modified)
router.get("/", async (req, res) => {
  try {
    // Remove customerId from populate since it's a string UID
    const orders = await CustomerOrder.find().populate("shopId");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
});

// Fetch customer orders by shop ID (modified)
router.get(
  "/shop/:shopId",
  [
    param("shopId")
      .custom(validateObjectId)
      .withMessage("Invalid shopId")
      .customSanitizer(sanitizeObjectId),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const shopId = req.params.shopId;
      // Remove customerId from populate
      const orders = await CustomerOrder.find({ shopId }).populate("shopId");
      res.json(orders);
    } catch (error) {
      console.error("Error fetching shop orders:", error);
      res.status(500).json({ error: "Failed to fetch shop orders" });
    }
  }
);

// Add a new customer order
router.post(
  "/",
  [
    body("customerId")
      .trim()
      .notEmpty()
      .withMessage("customerId is required")
      .isString()
      .withMessage("customerId must be a string"),
    body("shopId")
      .custom(validateObjectId)
      .withMessage("Invalid shopId")
      .customSanitizer(sanitizeObjectId),
    body("shopName")
      .trim()
      .notEmpty()
      .withMessage("shopName is required")
      .isString()
      .withMessage("shopName must be a string"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Item quantity must be a positive integer")
      .toInt(),
    body("items.*.price")
      .isFloat({ min: 0 })
      .withMessage("Item price must be a non-negative number")
      .toFloat(),
    body("items.*.name")
      .trim()
      .notEmpty()
      .withMessage("Item name is required")
      .isString()
      .withMessage("Item name must be a string"),
    body("payment")
      .optional()
      .isString()
      .isIn(["Paid", "Pending", "Failed"])
      .withMessage("Invalid payment status"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { customerId, shopId, shopName, items, payment } = req.body;
      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const orderId = await generateOrderId();

      const newOrder = new CustomerOrder({
        orderId,
        customerId,
        shopId,
        shopName,
        items,
        total: totalAmount,
        payment: payment || "Pending", // Default to "Pending" if not provided
        status: "Processing",
      });

      await newOrder.save();

      // Update Retailer Order
      let retailerOrder = await RetailerOrder.findOne({ shopId });

      if (retailerOrder) {
        retailerOrder.items.push(...items);
        retailerOrder.total += totalAmount;
        await retailerOrder.save();
      } else {
        retailerOrder = new RetailerOrder({
          shopId,
          shopName,
          items,
          total: totalAmount,
          status: "Processing",
        });
        await retailerOrder.save();
      }

      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error adding customer order:", error);
      res.status(500).json({ error: "Failed to add customer order" });
    }
  }
);

// Cancel customer order
router.put(
  "/:id/cancel",
  [
    param("id")
      .custom(validateObjectId)
      .withMessage("Invalid order ID")
      .customSanitizer(sanitizeObjectId),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const orderId = req.params.id;
      const order = await CustomerOrder.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.status === "Cancelled") {
        return res.status(400).json({ error: "Order already cancelled" });
      }

      order.status = "Cancelled";
      await order.save();

      const retailerOrder = await RetailerOrder.findOne({ shopId: order.shopId });

      if (retailerOrder) {
        const orderTotal = order.total || 0;
        retailerOrder.total -= orderTotal;

        // Ensure total doesn't go negative
        if (retailerOrder.total < 0) retailerOrder.total = 0;

        // Remove retailer order if total is zero
        if (retailerOrder.total === 0) {
          await RetailerOrder.deleteOne({ _id: retailerOrder._id });
        } else {
          await retailerOrder.save();
        }
      }

      res.json({ message: "Order cancelled successfully", order });
    } catch (error) {
      console.error("Error cancelling customer order:", error.message, error.stack);
      res.status(500).json({ error: "Failed to cancel customer order" });
    }
  }
);

module.exports = router;