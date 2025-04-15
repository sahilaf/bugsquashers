const express = require("express");
const Shop = require("../models/shopModel.js");
const Product = require("../models/product.js");
const router = express.Router();

// Helper function for sanitizing and validating numeric input
function parseCoordinate(value, min, max) {
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max) {
    return null;
  }
  return num;
}

// Helper function for validating positive integers with a default
function parsePositiveInt(value, defaultValue) {
  const num = parseInt(value, 10);
  return isNaN(num) || num < 1 ? defaultValue : num;
}

router.get("/nearby", async (req, res) => {
  try {
    // Validate and sanitize coordinates
    const lat = parseCoordinate(req.query.lat, -90, 90);
    const lng = parseCoordinate(req.query.lng, -180, 180);
    if (lat === null || lng === null) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or missing latitude/longitude" });
    }

    // Sanitize other inputs
    const maxDistance = parsePositiveInt(req.query.maxDistance, 100);
    const pageNumber = parsePositiveInt(req.query.page, 1);
    const limitNumber = parsePositiveInt(req.query.limit, 20);
    const skip = (pageNumber - 1) * limitNumber;

    // Build a safe filter. Only include allowed properties.
    const filter = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [lng, lat],
            maxDistance / 6378.1, // Earth's radius in kilometers
          ],
        },
      },
    };

    // For fields that accept only expected values, validate and sanitize.
    if (req.query.category) {
      // Assuming you have a list of permitted categories.
      const allowedCategories = ["groceries", "electronics", "clothing", "farm"]; // example whitelist
      const categories = req.query.category.split(",").filter(cat =>
        allowedCategories.includes(cat.trim().toLowerCase())
      );
      if (categories.length > 0) {
        filter.category = { $in: categories };
      }
    }

    if (req.query.rating) {
      const minRating = parseFloat(req.query.rating);
      if (isNaN(minRating) || minRating < 0 || minRating > 5) {
        return res
          .status(400)
          .json({ success: false, error: "Rating must be between 0 and 5" });
      }
      filter.rating = { $gte: minRating };
    }

    // Convert boolean strings to actual booleans
    if (req.query.organic === "true") {
      filter.isOrganicCertified = true;
    }
    if (req.query.local === "true") {
      filter.isLocalFarm = true;
    }

    // Optional: Only allow search on specific fields
    if (req.query.search) {
      // Instead of directly using the user-supplied regex,
      // you may choose to sanitize the input or use a predefined search index.
      const searchTerm = req.query.search.trim();
      // Note: In production, consider using a text index or a safe full‐text search engine.
      filter.$or = [{ name: { $regex: new RegExp(searchTerm, "i") } }];
    }

    // Query shops using the safe filter
    const shops = await Shop.find(filter).skip(skip).limit(limitNumber).lean();

    // For each shop, fetch its products safely
    const shopsWithProducts = await Promise.all(
      shops.map(async (shop) => {
        let products = [];
        if (shop.products && Array.isArray(shop.products) && shop.products.length > 0) {
          products = await Product.find({ shop: shop._id }).limit(10).lean();
        }
        return { ...shop, products };
      })
    );

    const totalCount = await Shop.countDocuments(filter);

    return res.json({
      success: true,
      count: shops.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
      data: shopsWithProducts,
    });
  } catch (err) {
    console.error("Error fetching nearby shops:", err);
    return res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "development" ? err.message : "Server error",
    });
  }
});

module.exports = router;
