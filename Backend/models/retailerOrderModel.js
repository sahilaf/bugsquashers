const mongoose = require("mongoose");

const retailerOrderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: String, required: true }, // Stored as string to match frontend (e.g., "$915.00")
  total: { type: String, required: true }, // Calculated as quantity * price
  status: {
    type: String,
    enum: ["Pending", "Processing", "Delivered"],
    default: "Pending",
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
});

module.exports = mongoose.model("RetailerOrder", retailerOrderSchema);