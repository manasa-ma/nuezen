const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// 1. CORS CONFIGURATION (Fixed for Vercel compatibility)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// 2. MONGODB CONNECTION
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 3. DATABASE MODELS
const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Employee" },
  salary: { type: Number, default: 50000 }
}));

const Attendance = mongoose.model("Attendance", new mongoose.Schema({
  userId: String, userName: String, date: String, time: String
}));

const Leave = mongoose.model("Leave", new mongoose.Schema({
  userId: String, userName: String, reason: String, status: { type: String, default: "Pending" }
}));

// Helper function to seed seed-data asynchronously without blocking app.listen
async function seedDemoUser() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const hash = bcrypt.hashSync("password123", 10);
      await User.create({ name: "HR Manager", email: "hr@neuzen.ai", password: hash, role: "HR" });
      console.log("🌱 Created hr@neuzen.ai / password123");
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
}
seedDemoUser();

// 4. ROUTES
app.get("/", (req, res) => res.json({ status: "STABLE_SYSTEM_ONLINE" }));

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Fixed: Used JWT_SECRET environment variable instead of hardcoded string "secret"
    const secretKey = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "7d" });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, salary: user.salary, token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ONBOARDING
app.post("/api/admin/users", async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;
    const hash = bcrypt.hashSync(password || "password123", 10);
    const newUser = await User.create({ name, email, password: hash, role, salary });
    res.status(201).json(newUser);
  } catch (err) { res.status(500).json({ message: "Failed to onboard: Email might exist" }); }
});

// MARK ATTENDANCE
app.post("/api/attendance", async (req, res) => {
  try {
    await Attendance.create(req.body);
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ message: "Attendance failed" }); }
});

// REQUEST LEAVE
app.post("/api/leaves", async (req, res) => {
  try {
    await Leave.create(req.body);
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ message: "Leave request failed" }); }
});

// 5. START SERVER (Fixed for Vercel Serverless requirements)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// Crucial step: Export the app module for Vercel handler execution
module.exports = app;
