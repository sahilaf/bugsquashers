const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  crop: String,
  quantity: String,
  price: String,
  status: { type: String, enum: ["Pending", "Processing", "Delivered"], default: "Pending" },
  date: { type: String, default: new Date().toISOString().split("T")[0] },
});

module.exports = mongoose.model("Order", orderSchema);
