require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const retailerRoutes = require("./routes/retailerRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Disable "X-Powered-By" for security
app.disable("x-powered-by");

// Define allowed CORS origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://your-production-domain.com"]
    : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5175","http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fairbasket")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit if MongoDB connection fails
  });

// API Routes
app.use("/api", userRoutes);
app.use("/api/retailer", retailerRoutes);

// Serve static files in production (if needed for frontend)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start Server with Error Handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle EADDRINUSE Error
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", err);
  }
});
