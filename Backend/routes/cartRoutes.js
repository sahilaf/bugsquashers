const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const CustomerOrder = require("../models/customerOrderModel");
const { v4: uuidv4 } = require("uuid");

router.post("/cart", async (req, res) => {
  try {
    const { uid, productId, quantity } = req.body;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    console.log(`Adding item to cart: uid=${uid}, productId=${productId}, quantity=${quantity}`);

    const updatedCart = await Cart.findOneAndUpdate(
      { uid },
      [
        {
          $set: {
            items: {
              $cond: {
                if: { $eq: [{ $type: "$items" }, "missing"] },
                then: [],
                else: "$items",
              },
            },
          },
        },
        {
          $set: {
            items: {
              $cond: {
                if: {
                  $in: [
                    new mongoose.Types.ObjectId(productId),
                    "$items.productId",
                  ],
                },
                then: {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: {
                      $cond: {
                        if: {
                          $eq: ["$$item.productId", new mongoose.Types.ObjectId(productId)],
                        },
                        then: {
                          productId: "$$item.productId",
                          quantity: { $add: ["$$item.quantity", quantity] },
                        },
                        else: "$$item",
                      },
                    },
                  },
                },
                else: {
                  $concatArrays: [
                    "$items",
                    [{ productId: new mongoose.Types.ObjectId(productId), quantity }],
                  ],
                },
              },
            },
          },
        },
      ],
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate("items.productId");

    console.log(`Cart updated: uid=${uid}, items=`, updatedCart.items);

    res.status(201).json(updatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      message: "Failed to add to cart",
      error: error.message,
    });
  }
});

router.get("/cart/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let cart = await Cart.findOne({ uid }).populate("items.productId");

    if (!cart) {
      cart = await Cart.findOneAndUpdate(
        { uid },
        { $setOnInsert: { items: [] } },
        { new: true, upsert: true, runValidators: true }
      );
      console.log(`Created empty cart for uid=${uid}`);
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
});

router.delete("/cart/:uid/item/:productId", async (req, res) => {
  try {
    const { uid, productId } = req.params;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { uid },
      {
        $pull: {
          items: { productId: new mongoose.Types.ObjectId(productId) },
        },
      },
      { new: true, runValidators: true }
    ).populate("items.productId");

    if (!updatedCart) {
      console.log(`Cart not found for uid=${uid}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log(`Item removed from cart: uid=${uid}, productId=${productId}`);
    res.status(200).json({ message: "Item removed from cart", cart: updatedCart });
  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    res.status(500).json({ message: "Failed to remove item from cart", error: error.message });
  }
});

router.put("/cart/:uid/item/:productId", async (req, res) => {
  try {
    const { uid, productId } = req.params;
    const { quantity } = req.body;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ uid });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ uid }).populate("items.productId");

    console.log(`Quantity updated: uid=${uid}, productId=${productId}, quantity=${quantity}`);
    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error("Error updating quantity:", error.message);
    res.status(500).json({ message: "Failed to update quantity", error: error.message });
  }
});

router.post("/cart/confirm", async (req, res) => {
  try {
    const { uid, items } = req.body;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid or empty cart items" });
    }

    console.log(`Confirming payment for uid=${uid}, items=`, items);

    let total = 0;
    const orderItems = [];
    const productUpdates = [];
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: `Invalid product ID: ${item.productId}` });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for product ${item.productId}` });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}: ${product.quantity} available` });
      }

      total += product.price * item.quantity;
      orderItems.push({
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
      productUpdates.push({ productId: item.productId, quantity: item.quantity });
    }

    const shipping = total > 35 ? 0 : 5.99;
    const tax = total * 0.08;
    const finalTotal = total + shipping + tax;

    try {
      for (const update of productUpdates) {
        await Product.findByIdAndUpdate(
          update.productId,
          {
            $inc: { quantity: -update.quantity, soldCount: update.quantity },
            $set: { updatedAt: new Date() },
          },
          { runValidators: true }
        );
      }
    } catch (error) {
      console.error("Error updating products:", error.message);
      return res.status(500).json({ message: "Failed to update product quantities", error: error.message });
    }

    let updatedCart;
    try {
      updatedCart = await Cart.findOneAndUpdate(
        { uid },
        { $set: { items: [] } },
        { runValidators: true, new: true }
      );
      if (!updatedCart) {
        throw new Error("Cart not found");
      }
    } catch (error) {
      console.error("Error clearing cart:", error.message);
      for (const update of productUpdates) {
        await Product.findByIdAndUpdate(
          update.productId,
          {
            $inc: { quantity: update.quantity, soldCount: -update.quantity },
            $set: { updatedAt: new Date() },
          },
          { runValidators: true }
        );
      }
      return res.status(500).json({ message: "Failed to clear cart", error: error.message });
    }

    let order;
    try {
      order = new CustomerOrder({
        orderId: uuidv4(),
        customerId: uid,
        shopId: "66f8a4b2c3d5e7f9a1b2c3d4",
        shopName: "Demo Shop",
        items: orderItems,
        total: finalTotal,
        payment: "Paid",
        status: "Processing",
        transactionStatus: "Completed",
        createdBy: uid,
        date: new Date(),
      });
      await order.save();
    } catch (error) {
      console.error("Error creating order:", error.message);
      for (const update of productUpdates) {
        await Product.findByIdAndUpdate(
          update.productId,
          {
            $inc: { quantity: update.quantity, soldCount: -update.quantity },
            $set: { updatedAt: new Date() },
          },
          { runValidators: true }
        );
      }
      await Cart.findOneAndUpdate(
        { uid },
        { $set: { items: items } },
        { runValidators: true }
      );
      return res.status(500).json({ message: "Failed to create order", error: error.message });
    }

    console.log(`Order confirmed for uid=${uid}, orderId=${order.orderId}`);
    res.status(200).json({ success: true, message: "Order confirmed", orderId: order.orderId });
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    res.status(500).json({ message: "Failed to confirm order", error: error.message });
  }
});

router.delete("/cart/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { uid },
      { $set: { items: [] } },
      { new: true, runValidators: true }
    ).populate("items.productId");

    if (!updatedCart) {
      console.log(`Cart not found for uid=${uid}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log(`Cart cleared for uid=${uid}`);
    res.status(200).json({ message: "Cart cleared", cart: updatedCart });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
});

module.exports = router;