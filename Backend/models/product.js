const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  keyFeatures: {
    type: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    validate: {
      validator: function(features) {
        return features.length <= 3; // Limit to 3 key features
      },
      message: 'Cannot have more than 3 key features'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 10000 // Reasonable upper limit
  },
  originalPrice: {
    type: Number,
    min: 0,
    max: 10000
  },
  images: {
    type: [{
      type: String,
      validate: {
        validator: function(url) {
          // Simple URL validation
          return /^(https?:\/\/).+\.(jpg|jpeg|png|webp|gif)$/i.test(url);
        },
        message: props => `${props.value} is not a valid image URL`
      }
    }],
    required: true,
    default: ["https://via.placeholder.com/200x150?text=Product+Image"],
    validate: {
      validator: function(images) {
        return images.length > 0; // At least one image required
      },
      message: 'At least one product image is required'
    }
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ["Groceries", "Fruits", "Vegetables", "Dairy", "Bakery", "Meat", "Beverages", "Organic", "Other"],
    default: "Other"
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,  // Ensure the quantity is never negative
    default: 0 // Default to 0 if not provided
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add discount percentage virtual field
productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
