const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the file path or URL
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Crop", cropSchema);