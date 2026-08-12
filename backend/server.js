const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());

// ======================================================
// DATABASE
// ======================================================

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

// ======================================================
// MODELS
// ======================================================

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "Employee",
  },

  salary: {
    type: DataTypes.INTEGER,
    defaultValue: 50000,
  },
});

const Leave = sequelize.define("Leave", {
  userName: {
    type: DataTypes.STRING,
  },

  userId: {
    type: DataTypes.INTEGER,
  },

  reason: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
});

const Attendance = sequelize.define("Attendance", {
  userName: {
    type: DataTypes.STRING,
  },

  userId: {
    type: DataTypes.INTEGER,
  },

  date: {
    type: DataTypes.STRING,
  },

  time: {
    type: DataTypes.STRING,
  },
});

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NEUZEN AI HRMS Backend is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

// ======================================================
// AUTH
// ======================================================

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "development-secret",
      {
        expiresIn: "7d",
      }
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

    res.status(500).json({
      message: "Server error during login",
    });
  }
});

// ======================================================
// ADMIN APIs
// ======================================================

// Get all users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to get users",
    });
  }
});

// Update user role
app.patch("/api/admin/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    const validRoles = ["Admin", "HR", "Employee"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const [updated] = await User.update(
      { role },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.error("Role update error:", error);

    res.status(500).json({
      message: "Failed to update role",
    });
  }
});

// Delete user
app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User removed from system",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

// Admin statistics
app.get("/api/admin/stats", async (req, res) => {
  try {
    const userCount = await User.count();

    const leaveCount = await Leave.count({
      where: {
        status: "Pending",
      },
    });

    const attendanceCount = await Attendance.count();

    res.json({
      userCount,
      leaveCount,
      attendanceCount,
    });
  } catch (error) {
    console.error("Stats error:", error);

    res.status(500).json({
      message: "Failed to get statistics",
    });
  }
});

// System settings
app.get("/api/admin/settings", (req, res) => {
  res.json({
    companyName: "NEUZEN AI",
    timezone: "IST",
    currency: "INR",
    maintenanceMode: false,
  });
});

// ======================================================
// HR APIs
// ======================================================

// Get employees
app.get("/api/hr/employees", async (req, res) => {
  try {
    const employees = await User.findAll({
      where: {
        role: "Employee",
      },
      attributes: {
        exclude: ["password"],
      },
    });

    res.json(employees);
  } catch (error) {
    console.error("Employees error:", error);

    res.status(500).json({
      message: "Failed to get employees",
    });
  }
});

// Get leaves
app.get("/api/hr/leaves", async (req, res) => {
  try {
    const leaves = await Leave.findAll();

    res.json(leaves);
  } catch (error) {
    console.error("Leaves error:", error);

    res.status(500).json({
      message: "Failed to get leaves",
    });
  }
});

// Get attendance
app.get("/api/hr/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.findAll();

    res.json(attendance);
  } catch (error) {
    console.error("Attendance error:", error);

    res.status(500).json({
      message: "Failed to get attendance",
    });
  }
});

// ======================================================
// LEAVE APIs
// ======================================================

// Employee applies for leave
app.post("/api/leaves", async (req, res) => {
  try {
    const {
      userName,
      userId,
      reason,
    } = req.body;

    if (!userName || !userId || !reason) {
      return res.status(400).json({
        message: "userName, userId and reason are required",
      });
    }

    const leave = await Leave.create({
      userName,
      userId,
      reason,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Leave request submitted",
      leave,
    });
  } catch (error) {
    console.error("Leave creation error:", error);

    res.status(500).json({
      message: "Failed to submit leave request",
    });
  }
});

// Approve/reject leave
app.patch("/api/leaves/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        message: "Invalid leave status",
      });
    }

    const [updated] = await Leave.update(
      { status },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    res.json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Leave status error:", error);

    res.status(500).json({
      message: "Failed to update leave",
    });
  }
});

// ======================================================
// ATTENDANCE APIs
// ======================================================

// Mark attendance
app.post("/api/attendance", async (req, res) => {
  try {
    const {
      userName,
      userId,
      date,
      time,
    } = req.body;

    if (!userName || !userId || !date || !time) {
      return res.status(400).json({
        message: "Attendance information is required",
      });
    }

    const attendance = await Attendance.create({
      userName,
      userId,
      date,
      time,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Attendance error:", error);

    res.status(500).json({
      message: "Failed to mark attendance",
    });
  }
});

// ======================================================
// DATABASE + SERVER START
// ======================================================

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("✅ Database connected");

    // Create demo users only when database is empty
    const count = await User.count();

    if (count === 0) {
      console.log("🌱 Creating demo users...");

      const hash = bcrypt.hashSync(
        "password123",
        10
      );

      await User.create({
        name: "Admin",
        email: "admin@neuzen.ai",
        password: hash,
        role: "Admin",
        salary: 100000,
      });

      await User.create({
        name: "HR",
        email: "hr@neuzen.ai",
        password: hash,
        role: "HR",
        salary: 75000,
      });

      await User.create({
        name: "Employee",
        email: "employee@neuzen.ai",
        password: hash,
        role: "Employee",
        salary: 50000,
      });

      console.log("✅ Demo users created");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Admin-Ready Backend running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });