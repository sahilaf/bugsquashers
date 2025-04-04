const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true }, // Replaces "season"
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  supplier: { type: String, default: "Unknown" },
  harvestDate: { type: String, default: "N/A" },
  expirationDate: { type: String, default: "N/A" },
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Crop", cropSchema);