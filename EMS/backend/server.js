require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// Route imports
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Employee Management API Running");
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
