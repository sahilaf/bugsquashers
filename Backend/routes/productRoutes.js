const express = require("express");
const Product = require("../models/product.js");
const Shop = require("../models/shopModel.js");

const router = express.Router();

// Create a new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    const updatedShop = await Shop.findByIdAndUpdate(
      product.shop,
      { $push: { products: product._id } },
      { new: true }
    );
    console.log("Updated Shop:", updatedShop);
    

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("shop");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;