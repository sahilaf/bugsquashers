require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const cropRoutes = require("./routes/cropRoutes");
const orderRoutes = require("./routes/orderRoutes");
const retailerOrderRoutes = require("./routes/retailerOrderRoutes");
const customerOrderRoutes = require("./routes/customerOrderRoutes");
const shopRoutes = require("./routes/shops");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Added cart routes
const path = require("path");
const rateLimit = require("express-rate-limit");
const fs = require("fs");

// Register models
require("./models/shopModel");
require("./models/customerOrderModel");
require("./models/retailerOrderModel");
require("./models/Cart"); // Added Cart model

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://your-production-domain.com"]
    : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5175", "http://localhost:5174"];

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

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use("/api", apiLimiter);

const uploadsDir = path.join(__dirname, "Uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fairbasket")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });

// API Routes
app.use("/api", userRoutes);
app.use("/api", cropRoutes);
app.use("/api", cartRoutes); // Added cart routes
app.use("/api/orders", orderRoutes);
app.use("/api/retailer-orders", retailerOrderRoutes);
app.use("/api/customer-orders", customerOrderRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);

const staticLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests for static files, please try again later.",
});

if (process.env.NODE_ENV === "production") {
  app.use(staticLimiter);
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const server = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(` Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    console.error(" Server error:", err);
  }
});