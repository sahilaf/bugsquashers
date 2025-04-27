const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/product");
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