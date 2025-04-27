const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { User, Admin, Shopkeeper, Deliveryman, Farmer } = require("../models/User");
const { body, validationResult } = require("express-validator");
const CustomerOrder = require("../models/customerOrderModel"); 
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


router.get("/getuserid/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: "User UID is required"
      });
    }

    // Find the user by Firebase UID and return just the MongoDB _id
    const user = await User.findOne({ uid }).select('_id');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    return res.json({
      success: true,
      userId: user._id
    });
  } catch (err) {
    console.error("Error fetching user ID:", err);
    return res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "development" ? err.message : "Server error"
    });
  }
});



// Existing GET route
router.get('/getuser/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      uid: user.uid,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      ...(user.role === 'Admin' && { permissions: user.permissions }),
      ...(user.role === 'Shopkeeper' && {
        shopName: user.shopName,
        shopLocation: user.shopLocation,
      }),
      ...(user.role === 'Deliveryman' && {
        vehicleType: user.vehicleType,
        assignedArea: user.assignedArea,
      }),
      ...(user.role === 'Farmer' && {
        farmName: user.farmName,
        farmLocation: user.farmLocation,
        crops: user.crops,
      }),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//  PUT route 
router.put('/updateuser/:uid', async (req, res) => {
  const { uid } = req.params;
  const { fullName, email, phone } = req.body;

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      message: 'Account updated successfully',
      user: {
        uid: user.uid,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/customer-orders/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: "Customer UID is required"
      });
    }

    // Find all orders for this customer sorted by date (newest first)
    const orders = await CustomerOrder.find({ customerId: uid })
      .sort({ date: -1 })
      .populate("shopId", "name location") // Populate shop details if needed
      .lean();
    
    // Format the orders to include readable dates and status
    const formattedOrders = orders.map(order => ({
      ...order,
      formattedDate: new Date(order.date).toLocaleDateString(),
      statusClass: getStatusClass(order.status)
    }));

    return res.status(200).json({
      success: true,
      orders: formattedOrders
    });
  } catch (err) {
    console.error("Error fetching customer orders:", err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

// Helper function to assign status classes for the frontend
function getStatusClass(status) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-purple-100 text-purple-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

module.exports = router;
