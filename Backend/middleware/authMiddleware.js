const admin = require("../config/firebase"); // Import Firebase Admin SDK

// Middleware to verify Firebase JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify the token
    req.user = decodedToken; // Attach user data to the request
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };