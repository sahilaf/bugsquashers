const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Crop = require("../models/Crop");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
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

// POST /api/crops - Add a new crop
router.post("/crops", upload.single("image"), async (req, res) => {
  try {
    const { name, price, stock, season } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newCrop = new Crop({
      name,
      price,
      stock,
      season,
      image,
    });

    const savedCrop = await newCrop.save();
    res.status(201).json(savedCrop);
  } catch (error) {
    console.error("Error adding crop:", error.message);
    res.status(500).json({ message: "Failed to add crop", error: error.message });
  }
});

// GET /api/crops - Fetch all crops
router.get("/crops", async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (error) {
    console.error("Error fetching crops:", error.message);
    res.status(500).json({ message: "Failed to fetch crops", error: error.message });
  }
});

module.exports = router;