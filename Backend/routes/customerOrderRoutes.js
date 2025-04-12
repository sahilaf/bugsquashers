// routes/customerOrderRoutes.js
const express = require("express");
const CustomerOrder = require("../models/customerOrderModel");
const RetailerOrder = require("../models/retailerOrderModel");
const router = express.Router();

// Generate unique order ID
const generateOrderId = async () => {
  const count = await CustomerOrder.countDocuments();
  return `CUST${String(count + 1).padStart(3, "0")}`;
};

// Fetch all customer orders (for customer or admin)
router.get("/", async (req, res) => {
  try {
    const orders = await CustomerOrder.find().populate("customerId shopId");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
});

// Fetch customer orders by shop (for retailer dashboard)
router.get("/shop/:shopId", async (req, res) => {
  try {
    const orders = await CustomerOrder.find({ shopId: req.params.shopId }).populate("customerId shopId");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    res.status(500).json({ error: "Failed to fetch shop orders" });
  }
});

// Add a new customer order
router.post("/", async (req, res) => {
  try {
    const { customerId, shopId, shopName, items, payment } = req.body;

    // Validate input
    if (!customerId || !shopId || !shopName || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const total = `$${totalAmount.toFixed(2)}`;

    // Generate order ID
    const orderId = await generateOrderId();

    // Create customer order
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

    // Update or create retailer order
    let retailerOrder = await RetailerOrder.findOne({ shopId });
    if (retailerOrder) {
      // Aggregate items (simplified: append items)
      retailerOrder.items = retailerOrder.items.concat(items);
      retailerOrder.total = `$${(
        parseFloat(retailerOrder.total.replace("$", "")) + totalAmount
      ).toFixed(2)}`;
      await retailerOrder.save();
    } else {
      // Create new retailer order
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
});

// Cancel customer order
router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ error: "Order already cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    // Update retailer order (simplified: mark as cancelled or reduce total)
    const retailerOrder = await RetailerOrder.findOne({ shopId: order.shopId });
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
});

module.exports = router;