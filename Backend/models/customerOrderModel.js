// models/customerOrderModel.js
const mongoose = require("mongoose");

const customerOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  shopName: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: String, required: true },
  payment: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Pending" },
  status: {
    type: String,
    enum: ["Delivered", "Processing", "Shipped", "Cancelled"],
    default: "Processing",
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomerOrder", customerOrderSchema);