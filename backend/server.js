// FIRST: Import your modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SECOND: Declare the app instance (Crucial - must happen before any app.use)
const app = express();

// THIRD: Apply configurations and middleware (Authorized for Vercel deployment)
app.use(cors({ 
  origin: [
    "http://localhost:5173", 
    "http://localhost:3000", 
    "https://vercel.app"
  ], 
  credentials: true 
}));
app.use(express.json());

// FOURTH: Connect Database
const mongoURI = process.env.MONGO_URI; 
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    isConnected = db.connections.readyState === 1;
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};
connectDB();

// FIFTH: Models
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

// SIXTH: All Routes
app.get("/", async (req, res) => {
  await connectDB();
  res.json({ status: "STABLE_SYSTEM_ONLINE" });
});

// LOGIN (With Dynamic Seeding Fallback for HR, Admin, and Employee)
app.post("/api/auth/login", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // SERVERLESS FIX: Automatically seeds all 3 standard test roles if missing from DB
    if (!user) {
      const hash = bcrypt.hashSync("password123", 10);
      
      if (email === "hr@neuzen.ai") {
        user = await User.create({ name: "HR Manager", email: "hr@neuzen.ai", password: hash, role: "HR" });
        console.log("🌱 Seeded: hr@neuzen.ai");
      } else if (email === "admin@neuzen.ai") {
        user = await User.create({ name: "System Admin", email: "admin@neuzen.ai", password: hash, role: "Admin" });
        console.log("🌱 Seeded: admin@neuzen.ai");
      } else if (email === "employee@neuzen.ai") {
        user = await User.create({ name: "John Doe", email: "employee@neuzen.ai", password: hash, role: "Employee" });
        console.log("🌱 Seeded: employee@neuzen.ai");
      }
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const secretKey = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "7d" });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, salary: user.salary, token });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// ONBOARDING
app.post("/api/admin/users", async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, role, salary } = req.body;
    const hash = bcrypt.hashSync(password || "password123", 10);
    const newUser = await User.create({ name, email, password: hash, role, salary });
    res.status(201).json(newUser);
  } catch (err) { 
    res.status(500).json({ message: "Failed to onboard" }); 
  }
});

// MARK ATTENDANCE
app.post("/api/attendance", async (req, res) => {
  try { 
    await connectDB();
    await Attendance.create(req.body); 
    res.status(201).json({ success: true }); 
  } catch (err) { 
    res.status(500).json({ message: "Attendance failed" }); 
  }
});

// REQUEST LEAVE
app.post("/api/leaves", async (req, res) => {
  try { 
    await connectDB();
    await Leave.create(req.body); 
    res.status(201).json({ success: true }); 
  } catch (err) { 
    res.status(500).json({ message: "Leave request failed" }); 
  }
});

// SEVENTH: Local Server execution rule
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Local Server running on port ${PORT}`));
}

// EIGHTH: Export app for serverless function assignment
module.exports = app;
