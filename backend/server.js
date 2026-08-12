const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// 1. TOTAL CORS CONTROL
// This allows EVERYTHING. No browser will block this.
app.use(cors()); 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // This fixes the 'Cannot connect' error
  }
  next();
});

app.use(express.json());

// 2. DATABASE (SQLite Path Fix)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
  logging: false,
});

// 3. MODELS
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

// 4. ROUTES (Including all missing ones)
app.get("/", (req, res) => res.send("Server is Live 🚀"));

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "7d" });
    res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, salary: user.salary, token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/admin/users", async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;
    const hash = bcrypt.hashSync(password || "password123", 10);
    const newUser = await User.create({ name, email, password: hash, role, salary });
    res.status(201).json(newUser);
  } catch (err) { res.status(500).json({ message: "Creation failed" }); }
});

app.post("/api/attendance", async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json(record);
  } catch (err) { res.status(500).json({ message: "Attendance failed" }); }
});

// 5. START (Correct Railway Binding)
const PORT = process.env.PORT || 5000;
sequelize.sync().then(async () => {
  const count = await User.count();
  if (count === 0) {
    const hash = bcrypt.hashSync("password123", 10);
    await User.create({ name: "HR", email: "hr@neuzen.ai", password: hash, role: "HR" });
    await User.create({ name: "Employee", email: "employee@neuzen.ai", password: hash, role: "Employee" });
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Port: ${PORT}`));
});