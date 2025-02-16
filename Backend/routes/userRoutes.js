const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

router.post(
  "/signup",
  [
    body("uid").trim().isLength({ min: 1 }).escape(),
    body("fullName").trim().isLength({ min: 1 }).escape(),
    body("email").trim().isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors.array() });
      }

      const { uid, fullName, email } = req.body;

      // Securely query the database using sanitized input
      const existingUser = await User.findOne({
        $or: [{ uid: String(uid) }, { email: String(email) }],
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user
      const newUser = new User({ uid: String(uid), fullName: String(fullName), email: String(email) });
      await newUser.save();

      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user", error });
    }
  }
);

module.exports = router;
