const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // Assuming this correctly verifies JWTs
const { User, Admin, Shopkeeper, Deliveryman, Farmer } = require("../models/User");
const { body, validationResult } = require("express-validator");
const mongoose = require('mongoose'); // Import mongoose

// User Signup Route
router.post(
    "/signup",
    [
        // Improved validation:
        body("uid").trim().notEmpty().withMessage("UID is required").escape(),
        body("fullName").trim().notEmpty().withMessage("Full name is required").escape(),
        body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
        body("role").optional().isIn(["Admin", "User", "Shopkeeper", "Deliveryman", "Farmer"]).withMessage("Invalid role"),
        // Role-specific validation:
        body("shopName").if(body('role').equals('Shopkeeper')).trim().notEmpty().withMessage("Shop name is required for Shopkeepers").escape(),
        body("shopLocation").if(body('role').equals('Shopkeeper')).trim().notEmpty().withMessage("Shop location is required for Shopkeepers").escape(),
        body("vehicleType").if(body('role').equals('Deliveryman')).trim().notEmpty().withMessage("Vehicle type is required for Deliverymen").escape(),
        body("assignedArea").if(body('role').equals('Deliveryman')).trim().notEmpty().withMessage("Assigned area is required for Deliverymen").escape(),
        body("farmName").if(body('role').equals('Farmer')).trim().notEmpty().withMessage("Farm name is required for Farmers").escape(),
        body("farmLocation").if(body('role').equals('Farmer')).trim().notEmpty().withMessage("Farm location is required for Farmers").escape(),
        body("crops").if(body('role').equals('Farmer')).isArray().withMessage("Crops must be an array"),
        body("crops.*").if(body('role').equals('Farmer')).trim().notEmpty().escape(), //check individual crops
    ],
    async (req, res) => {
        try {
            // 1. Input Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Validation failed", errors: errors.array() });
            }

            // 2. Data Sanitization and Preparation
            const uid = req.body.uid.trim();
            const fullName = req.body.fullName.trim();
            const email = req.body.email.toLowerCase();
            const role = req.body.role || "User";

            // 3. Check for Existing User (Prevent Duplicates)
            // Use mongoose.Types.ObjectId.isValid() to prevent potential issues.
            const existingUser = await User.findOne({
                $or: [
                    { uid: uid }, // Use the sanitized uid
                    { email: email } // Use the sanitized email
                ]
            });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // 4. User Creation Based on Role (Use a Factory Pattern or similar for better organization)
            let newUser;
             const userData = { uid, fullName, email, role };

            switch (role) {
                case "Admin":
                    newUser = new Admin(userData);
                    break;
                case "Shopkeeper":
                    newUser = new Shopkeeper({ ...userData, shopName: req.body.shopName, shopLocation: req.body.shopLocation });
                    break;
                case "Deliveryman":
                    newUser = new Deliveryman({ ...userData, vehicleType: req.body.vehicleType, assignedArea: req.body.assignedArea });
                    break;
                case "Farmer":
                      const crops = Array.isArray(req.body.crops) ? req.body.crops.map(crop => crop.trim()) : [];
                    newUser = new Farmer({ ...userData, farmName: req.body.farmName, farmLocation: req.body.farmLocation, crops });
                    break;
                default:
                    newUser = new User(userData);
            }

            // 5. Save the User
            await newUser.save();
            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (error) {
            // 6. Error Handling
            console.error("❌ Error creating user:", error);
            res.status(500).json({ message: "Internal server error: " + error.message }); // Include error message for debugging
        }
    }
);

// 2. Route to fetch user data by UID.  Use route parameter
router.get("/user/:uid", verifyToken, async (req, res) => {
    try {
        const uid = req.params.uid;

        if (!uid) {
            return res.status(400).json({ message: "UID is required" });
        }
        const user = await User.findOne({ uid: uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
});

// 3. Route to get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "uid fullName email role");
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Internal server error: " + error.message }); // Include the error message
    }
});

module.exports = router;
