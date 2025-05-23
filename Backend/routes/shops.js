const express = require("express");
const Shop = require("../models/shopModel.js");
const Product = require("../models/product.js");
const router = express.Router();
const mongoose = require("mongoose");
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
    console.log('Parsed coordinates:', { lat, lng });
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




router.post("/", async (req, res) => {
  try {
    const {
      name,
      location, // Expect GeoJSON { type: "Point", coordinates: [lng, lat] }
      category,
      rating,
      isOrganicCertified,
      isLocalFarm,
      owner, // must be a valid user _id
    } = req.body;

    // Validate required fields
    if (!name || !location || !owner) {
      return res.status(400).json({ error: "Name, location, and owner are required" });
    }

    // Validate location (GeoJSON format)
    if (
      !location.type ||
      location.type !== "Point" ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({ error: "Invalid location format. Must be GeoJSON Point" });
    }

    const [lng, lat] = location.coordinates;
    if (
      isNaN(lat) || lat < -90 || lat > 90 ||
      isNaN(lng) || lng < -180 || lng > 180
    ) {
      return res.status(400).json({ error: "Invalid latitude or longitude" });
    }

    // Validate owner ID
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid owner ID" });
    }

    const newShop = new Shop({
      name,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      category,
      rating,
      isOrganicCertified: !!isOrganicCertified,
      isLocalFarm: !!isLocalFarm,
      owner,
    });

    const savedShop = await newShop.save();
    res.status(201).json({ success: true, data: savedShop });
  } catch (err) {
    console.error("Error creating shop:", err);
    res.status(500).json({ error: err.message });
  }
});


// Add to shopRoutes.js
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    // Validate owner ID
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ success: false, error: "Invalid owner ID" });
    }
    
    const shop = await Shop.findOne({ owner: ownerId });
    
    if (!shop) {
      return res.status(404).json({ 
        success: false, 
        error: "No shop found for this owner" 
      });
    }
    
    return res.json({
      success: true,
      data: shop
    });
  } catch (err) {
    console.error("Error fetching shop by owner:", err);
    return res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "development" ? err.message : "Server error"
    });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate location if present
    if (updates.location) {
      const [lng, lat] = updates.location.coordinates;
      if (
        isNaN(lat) || lat < -90 || lat > 90 ||
        isNaN(lng) || lng < -180 || lng > 180
      ) {
        return res.status(400).json({ error: "Invalid coordinates" });
      }
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json({ success: true, data: updatedShop });
  } catch (err) {
    console.error("Error updating shop:", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
