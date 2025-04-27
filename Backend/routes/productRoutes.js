const express = require("express");
const Product = require("../models/product.js");
const Shop = require("../models/shopModel.js");

const router = express.Router();

// Create a new product
router.post("/", async (req, res) => {
  try {
    const { shop, ...productData } = req.body;
    
    // Validate shop exists
    const shopExists = await Shop.findById(shop);
    if (!shopExists) {
      return res.status(400).json({ error: "Shop not found" });
    }

    const product = new Product({
      ...productData,
      shop
    });
    
    await product.save();

    // Update the shop's products array
    await Shop.findByIdAndUpdate(
      shop,
      { $addToSet: { products: product._id } },
      { new: true }
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all products with optional shop filter
router.get("/", async (req, res) => {
  try {
    const { shop } = req.query;
    const filter = shop ? { shop } : {};
    
    const products = await Product.find(filter).populate("shop", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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
    
    // Remove product reference from shop
    await Shop.findByIdAndUpdate(
      product.shop,
      { $pull: { products: product._id } }
    );
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;