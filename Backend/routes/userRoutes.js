const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { User, Admin, Shopkeeper, Deliveryman, Farmer } = require("../models/User");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

// Define rate limiters
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 signup requests per windowMs per IP
  message: { message: "Too many signup attempts, please try again later." },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 API requests per windowMs per IP
  message: { message: "Too many requests, please try again later." },
});

// Apply rate limiter to signup route
router.post(
  "/signup",
  signupLimiter,
  [
    body("uid").trim().isLength({ min: 1 }).escape(),
    body("fullName").trim().isLength({ min: 1 }).escape(),
    body("email").trim().isEmail().normalizeEmail(),
    body("role").optional().isIn(["Admin", "User", "Shopkeeper", "Deliveryman", "Farmer"]),
  ],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
      }

      // Securely extract and sanitize input
      const uid = String(req.body.uid).trim();
      const fullName = String(req.body.fullName).trim();
      const email = String(req.body.email).trim().toLowerCase();
      const role = req.body.role || "User";

      // Prevent NoSQL Injection
      const existingUser = await User.findOne({
        $or: [{ uid: { $eq: uid } }, { email: { $eq: email } }],
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user based on role
      let newUser;
      switch (role) {
        case "Admin":
          newUser = new Admin({ uid, fullName, email, role });
          break;
        case "Shopkeeper":
          newUser = new Shopkeeper({ uid, fullName, email, role, shopName: req.body.shopName, shopLocation: req.body.shopLocation });
          break;
        case "Deliveryman":
          newUser = new Deliveryman({ uid, fullName, email, role, vehicleType: req.body.vehicleType, assignedArea: req.body.assignedArea });
          break;
        case "Farmer":
          newUser = new Farmer({
            uid,
            fullName,
            email,
            role,
            farmName: req.body.farmName,
            farmLocation: req.body.farmLocation,
            crops: Array.isArray(req.body.crops) ? req.body.crops : [],
          });
          break;
        default:
          newUser = new User({ uid, fullName, email, role });
      }

      // Save user to database
      await newUser.save();
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("❌ Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Apply rate limiter to all other API routes
router.use(apiLimiter);

// Protected route to fetch user data based on Firebase token
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: { $eq: req.user.uid } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET endpoint to fetch all users (for admin use)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "uid fullName email role");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET /api/user/mongo-id/:firebaseId
router.get('/mongo-id/:firebaseId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.firebaseId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ mongoId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching MongoDB ID' });
  }
});


module.exports = router;
