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

// Fetch all customer orders
router.get("/", async (req, res) => {
  try {
    const orders = await CustomerOrder.find().populate("customerId shopId");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
});

// Fetch customer orders by shop ID
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
      const orders = await CustomerOrder.find({ shopId: mongoose.Types.ObjectId(shopId) }).populate("customerId shopId");
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
      .custom(validateObjectId)
      .withMessage("Invalid customerId")
      .customSanitizer(sanitizeObjectId),
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
      .optional()
      .isString()
      .withMessage("Item name must be a string")
      .trim(),
    body("payment")
      .optional()
      .isObject()
      .withMessage("Payment must be an object"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { customerId, shopId, shopName, items, payment } = req.body;
      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const total = `$${totalAmount.toFixed(2)}`;
      const orderId = await generateOrderId();

      const newOrder = new CustomerOrder({
        orderId,
        customerId,
        shopId,
        shopName,
        items,
        total,
        payment,
        status: "Processing",
      });

      await newOrder.save();

      let retailerOrder = await RetailerOrder.findOne({ shopId: mongoose.Types.ObjectId(shopId) });

      if (retailerOrder) {
        retailerOrder.items = retailerOrder.items.concat(items);
        retailerOrder.total = `$${(
          parseFloat(retailerOrder.total.replace("$", "")) + totalAmount
        ).toFixed(2)}`;
        await retailerOrder.save();
      } else {
        retailerOrder = new RetailerOrder({
          shopId,
          shopName,
          items,
          total,
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

      const retailerOrder = await RetailerOrder.findOne({ shopId: mongoose.Types.ObjectId(order.shopId) });

      if (retailerOrder) {
        const orderTotal = parseFloat(order.total.replace("$", ""));
        retailerOrder.total = `$${(
          parseFloat(retailerOrder.total.replace("$", "")) - orderTotal
        ).toFixed(2)}`;

        if (retailerOrder.total === "$0.00") {
          await RetailerOrder.deleteOne({ _id: retailerOrder._id });
        } else {
          await retailerOrder.save();
        }
      }

      res.json(order);
    } catch (error) {
      console.error("Error cancelling customer order:", error);
      res.status(500).json({ error: "Failed to cancel customer order" });
    }
  }
);

module.exports = router;
