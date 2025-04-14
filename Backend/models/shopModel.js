const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  category: {
    type: String,
    enum: ["Groceries", "Fruits", "Vegetables", "Dairy", "Bakery", "Meat", "Beverages", "Organic", "Other"],
    default: "Other",
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  isOrganicCertified: {
    type: Boolean,
    default: false,
  },
  isLocalFarm: {
    type: Boolean,
    default: false,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);

module.exports = Shop;