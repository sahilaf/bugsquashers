const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    index: true, // Add index for faster queries
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);