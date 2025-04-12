// routes/customerOrderRoutes.js
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
  param("shopId").custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid shopId"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const orders = await CustomerOrder.find({ shopId: req.params.shopId }).populate("customerId shopId");
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
    body("customerId").custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid customerId"),
    body("shopId").custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid shopId"),
    body("shopName").trim().notEmpty().withMessage("shopName is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.quantity").isNumeric().withMessage("Item quantity must be numeric"),
    body("items.*.price").isNumeric().withMessage("Item price must be numeric"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

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

      let retailerOrder = await RetailerOrder.findOne({ shopId });
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
  param("id").custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid order ID"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const order = await CustomerOrder.findById(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.status === "Cancelled") return res.status(400).json({ error: "Order already cancelled" });

      order.status = "Cancelled";
      await order.save();

      const retailerOrder = await RetailerOrder.findOne({ shopId: order.shopId });
      if (retailerOrder) {
        const orderTotal = parseFloat(order.total.replace("$", ""));
        retailerOrder.total = `$${(parseFloat(retailerOrder.total.replace("$", "")) - orderTotal).toFixed(2)}`;

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
