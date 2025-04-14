const express = require("express");
const Shop = require("../models/shopModel.js");
const Product = require("../models/product.js");
const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const {
      lat,
      lng,
      maxDistance = 100,
      category,
      rating,
      organic,
      local,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ success: false, error: "Latitude and longitude are required" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (
      isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid coordinates provided" });
    }

    const filter = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            parseInt(maxDistance, 10) / 6378.1,
          ],
        },
      },
    };

    if (category) {
      filter.category = { $in: category.split(",") };
    }

    if (rating) {
      const minRating = parseFloat(rating);
      if (minRating < 0 || minRating > 5) {
        return res
          .status(400)
          .json({ success: false, error: "Rating must be between 0 and 5" });
      }
      filter.rating = { $gte: minRating };
    }

    if (organic === "true") filter.isOrganicCertified = true;
    if (local === "true") filter.isLocalFarm = true;

    // Add search query filtering
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    // Find shops
    const shops = await Shop.find(filter).skip(skip).limit(limitNumber).lean();

    // For each shop, fetch its products by ID
    const shopsWithProducts = await Promise.all(
      shops.map(async (shop) => {
        // The shop has product IDs in its products array
        // We need to fetch the actual product documents
        let products = [];
        if (shop.products && shop.products.length > 0) {
          products = await Product.find({
            shop: shop._id,
          })
            .limit(10)
            .lean();
        }

        return { ...shop, products };
      })
    );

    const totalCount = await Shop.countDocuments(filter);

    res.json({
      success: true,
      count: shops.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
      data: shopsWithProducts,
    });
  } catch (err) {
    console.error("Error fetching nearby shops:", err);
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "development" ? err.message : "Server error",
    });
  }
});

module.exports = router;
