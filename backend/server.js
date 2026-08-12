const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// ======================================================
// 1. IMPROVED CORS (Allows all Vercel actions)
// ======================================================
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ======================================================
// 2. DATABASE (SQLite Fix for Railway)
// ======================================================
// Using /tmp/ ensures the database is writable on Railway environments
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/database.sqlite' 
  : path.join(__dirname, 'database.sqlite');

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

// ======================================================
// 3. MODELS
// ======================================================
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "Employee" },
  salary: { type: DataTypes.INTEGER, defaultValue: 50000 },
});

const Attendance = sequelize.define("Attendance", {
  userId: { type: DataTypes.INTEGER },
  userName: { type: DataTypes.STRING },
  date: { type: DataTypes.STRING },
  time: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: "Present" }
});

const Leave = sequelize.define("Leave", {
  userId: { type: DataTypes.INTEGER },
  userName: { type: DataTypes.STRING },
  reason: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: "Pending" }
});

// ======================================================
// 4. ROUTES
// ======================================================

app.get("/", (req, res) => res.json({ status: "Online", message: "NEUZEN AI HRMS Live" }));

// --- AUTH & ONBOARDING (User Creation) ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, "secret123", { expiresIn: "7d" });
    res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, salary: user.salary, token });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// THIS IS THE ONBOARDING ROUTE
app.post("/api/admin/users", async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;
    const hashedPassword = bcrypt.hashSync(password || "password123", 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role, salary });
    res.status(201).json(newUser);
  } catch (e) { res.status(500).json({ message: "Onboarding failed: " + e.message }); }
});

// --- ATTENDANCE ---
app.post("/api/attendance", async (req, res) => {
  try {
    const { userId, userName, date, time } = req.body;
    const record = await Attendance.create({ userId, userName, date, time });
    res.status(201).json(record);
  } catch (e) { res.status(500).json({ message: "Failed to mark attendance" }); }
});

// --- LEAVES ---
app.post("/api/leaves", async (req, res) => {
  try {
    const { userId, userName, reason } = req.body;
    const leave = await Leave.create({ userId, userName, reason });
    res.status(201).json(leave);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- GET DATA ---
app.get("/api/admin/users", async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
});

// ======================================================
// 5. START SERVER
// ======================================================
const PORT = process.env.PORT || 5000;
sequelize.sync().then(async () => {
  const count = await User.count();
  if (count === 0) {
    const hash = bcrypt.hashSync("password123", 10);
    await User.create({ name: "HR Manager", email: "hr@neuzen.ai", password: hash, role: "HR" });
    await User.create({ name: "John Employee", email: "employee@neuzen.ai", password: hash, role: "Employee" });
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server on port ${PORT}`));
});