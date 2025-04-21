const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
    {
      cropId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Crop",
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