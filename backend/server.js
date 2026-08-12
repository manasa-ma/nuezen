const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// ======================================================
// MIDDLEWARE (Updated CORS)
// ======================================================

// This allows both your main Vercel URL and any Vercel Preview URLs to talk to the backend
app.use(cors({
  origin: true, // This allows all origins for testing; change to your specific URL later for security
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ======================================================
// DATABASE (SQLite)
// ======================================================

const sequelize = new Sequelize({
  dialect: "sqlite",
  // On Railway, it's best to use an absolute path for the database file
  storage: path.join(__dirname, "database.sqlite"),
  logging: false,
});

// ======================================================
// MODELS
// ======================================================

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "Employee" },
  salary: { type: DataTypes.INTEGER, defaultValue: 50000 },
});

const Leave = sequelize.define("Leave", {
  userName: { type: DataTypes.STRING },
  userId: { type: DataTypes.INTEGER },
  reason: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
});

const Attendance = sequelize.define("Attendance", {
  userName: { type: DataTypes.STRING },
  userId: { type: DataTypes.INTEGER },
  date: { type: DataTypes.STRING },
  time: { type: DataTypes.STRING },
});

// ======================================================
// ROUTES
// ======================================================

app.get("/", (req, res) => {
  res.json({ success: true, message: "NEUZEN AI HRMS Backend is running 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is healthy" });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "development-secret",
      { expiresIn: "7d" }
    );

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      salary: user.salary,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ADMIN: Get all users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users" });
  }
});

// HR: Get employees
app.get("/api/hr/employees", async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: "Employee" },
      attributes: { exclude: ["password"] },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to get employees" });
  }
});

// LEAVE: Mark Attendance
app.post("/api/attendance", async (req, res) => {
  try {
    const { userName, userId, date, time } = req.body;
    const attendance = await Attendance.create({ userName, userId, date, time });
    res.status(201).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark attendance" });
  }
});

// ======================================================
// SERVER START
// ======================================================

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(async () => {
  console.log("✅ Database connected");

  // Create demo users if DB is empty
  const count = await User.count();
  if (count === 0) {
    console.log("🌱 Creating demo users...");
    const hash = bcrypt.hashSync("password123", 10);
    
    await User.create({ name: "Admin", email: "admin@neuzen.ai", password: hash, role: "Admin", salary: 100000 });
    await User.create({ name: "HR", email: "hr@neuzen.ai", password: hash, role: "HR", salary: 75000 });
    await User.create({ name: "Employee", email: "employee@neuzen.ai", password: hash, role: "Employee", salary: 50000 });
    
    console.log("✅ Demo users created");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("❌ Database connection failed:", error);
});