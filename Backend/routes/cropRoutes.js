const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Crop = require("../models/Crop");

// 📌 Function to sanitize input (prevents script injection)
const sanitizeInput = (input) => input.replace(/[<>]/g, "");

// 📌 Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only PNG, JPG, or JPEG images are allowed!"));
  },
});

// 📌 POST /api/crops - Add a new crop
router.post("/crops", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, stock, supplier, harvestDate, expirationDate } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (!name || !category || !price || !stock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Sanitize user input
    const newCrop = new Crop({
      name: sanitizeInput(name),
      category: sanitizeInput(category),
      price: Number(price),
      stock: Number(stock),
      supplier: sanitizeInput(supplier),
      harvestDate,
      expirationDate,
      image,
    });

    const savedCrop = await newCrop.save();
    res.status(201).json(savedCrop);
  } catch (error) {
    console.error("Error adding crop:", error.message);
    res.status(500).json({ message: "Failed to add crop", error: error.message });
  }
});

// 📌 GET /api/crops - Fetch all crops (with query parameter whitelist)
router.get("/crops", async (req, res) => {
  try {
    const allowedFilters = ["name", "category"]; // Only allow these fields for queries
    const filters = Object.keys(req.query).reduce((acc, key) => {
      if (allowedFilters.includes(key)) {
        acc[key] = req.query[key]; // Only allow safe fields
      }
      return acc;
    }, {});

    const crops = await Crop.find(filters);
    res.status(200).json(crops);
  } catch (error) {
    console.error("Error fetching crops:", error.message);
    res.status(500).json({ message: "Failed to fetch crops", error: error.message });
  }
});

// 📌 PUT /api/crops/:id - Update a crop securely
router.put("/crops/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid crop ID" });
    }

    const { name, category, price, stock, supplier, harvestDate, expirationDate } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedCrop = await Crop.findByIdAndUpdate(
      { _id: { $eq: id } }, // Secure against NoSQL injection
      {
        name: sanitizeInput(name),
        category: sanitizeInput(category),
        price: Number(price),
        stock: Number(stock),
        supplier: sanitizeInput(supplier),
        harvestDate,
        expirationDate,
        ...(image && { image }), // Only update image if provided
      },
      { new: true }
    );

    if (!updatedCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.status(200).json(updatedCrop);
  } catch (error) {
    console.error("Error updating crop:", error.message);
    res.status(500).json({ message: "Failed to update crop", error: error.message });
  }
});

// 📌 DELETE /api/crops/:id - Securely delete a crop
router.delete("/crops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid crop ID" });
    }

    const deletedCrop = await Crop.findByIdAndDelete({ _id: { $eq: id } }); // Prevents NoSQL injection
    if (!deletedCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.status(200).json({ message: "Crop deleted successfully" });
  } catch (error) {
    console.error("Error deleting crop:", error.message);
    res.status(500).json({ message: "Failed to delete crop", error: error.message });
  }
});

module.exports = router;
