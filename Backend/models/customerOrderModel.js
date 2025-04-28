const mongoose = require("mongoose");

const customerOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: String, ref: "User", required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  shopName: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  payment: {
    type: String,
    enum: ["Paid", "Pending", "Failed"],
    default: "Pending",
  },
  status: {
    type: String,
    enum: ["Delivered", "Processing", "Shipped", "Cancelled"],
    default: "Processing",
  },
  transactionStatus: {
    type: String,
    enum: ["Completed", "Partial", "Failed"],
    default: "Partial",
  },
  createdBy: { type: String, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  shippingInfo: {
    name: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
});

customerOrderSchema.index({ orderId: 1 });
customerOrderSchema.index({ customerId: 1, date: -1 });

module.exports = mongoose.model("CustomerOrder", customerOrderSchema);