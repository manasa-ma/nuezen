const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// ======================================================
// 1. TOTAL CORS CONTROL (Fixes "Cannot Connect" error)
// ======================================================
app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

// ======================================================
// 2. DATABASE (SQLite Setup)
// ======================================================
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
  logging: false,
});

// ======================================================
// 3. MODELS
// ======================================================
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  salary: { type: DataTypes.INTEGER, defaultValue: 50000 }
});

const Attendance = sequelize.define("Attendance", {
  userId: { type: DataTypes.INTEGER },
  userName: { type: DataTypes.STRING },
  date: { type: DataTypes.STRING },
  time: { type: DataTypes.STRING }
});

const Leave = sequelize.define("Leave", {
  userId: { type: DataTypes.INTEGER },
  userName: { type: DataTypes.STRING },
  reason: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: "Pending" }
});

// ======================================================
// 4. ALL ROUTES (Login, Onboarding, Attendance, Leaves)
// ======================================================

// Health Check
app.get("/", (req, res) => res.json({ message: "FULL_SYSTEM_ONLINE_V3" }));

// --- LOGIN ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, "secret", { expiresIn: "7d" });
    res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, salary: user.salary, token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- ONBOARDING (Admin/HR Create User) ---
app.post("/api/admin/users", async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;
    const hash = bcrypt.hashSync(password || "password123", 10);
    const newUser = await User.create({ name, email, password: hash, role, salary });
    res.status(201).json(newUser);
  } catch (err) { res.status(500).json({ message: "Failed to onboard user" }); }
});

// --- ATTENDANCE (Marking) ---
app.post("/api/attendance", async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json(record);
  } catch (err) { res.status(500).json({ message: "Attendance failed" }); }
});

// --- LEAVES (Requesting) ---
app.post("/api/leaves", async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (err) { res.status(500).json({ message: "Leave request failed" }); }
});

// --- GET ALL USERS (For Dashboard) ---
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
  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 System Online: ${PORT}`));
});