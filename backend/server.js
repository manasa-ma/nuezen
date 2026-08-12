const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });

// MODELS
const User = sequelize.define('User', {
    name: DataTypes.STRING, 
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING, 
    role: DataTypes.STRING, 
    salary: { type: DataTypes.INTEGER, defaultValue: 50000 }
});

const Leave = sequelize.define('Leave', {
    userName: DataTypes.STRING, userId: DataTypes.INTEGER, reason: DataTypes.STRING, status: { type: DataTypes.STRING, defaultValue: 'Pending' }
});

const Attendance = sequelize.define('Attendance', {
    userName: DataTypes.STRING, userId: DataTypes.INTEGER, date: DataTypes.STRING, time: DataTypes.STRING
});

// --- ADMIN ACTIONS API ---

// 1. Get All Users for Management
app.get('/api/admin/users', async (req, res) => {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
});

// 2. Change User Role (Role Assignment Requirement)
app.patch('/api/admin/users/:id/role', async (req, res) => {
    const { role } = req.body;
    await User.update({ role }, { where: { id: req.params.id } });
    res.json({ message: "Role updated" });
});

// 3. Delete Employee (Employee Management Requirement)
app.delete('/api/admin/users/:id', async (req, res) => {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
});

// 4. System Stats
app.get('/api/admin/stats', async (req, res) => {
    const userCount = await User.count();
    const leaveCount = await Leave.count({ where: { status: 'Pending' } });
    const attendanceCount = await Attendance.count();
    res.json({ userCount, leaveCount, attendanceCount });
});

// --- AUTH & OTHER ROUTES ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, 'secret');
        res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, token });
    } else { res.status(401).json({ message: "Fail" }); }
});

// (Keep your HR employees, onboard, and leaves routes here...)
app.get('/api/hr/employees', async (req, res) => res.json(await User.findAll({ where: { role: 'Employee' } })));
app.get('/api/hr/leaves', async (req, res) => res.json(await Leave.findAll()));
app.get('/api/hr/attendance', async (req, res) => res.json(await Attendance.findAll()));

// START & SEED
const PORT = 5000;
sequelize.sync({ force: false }).then(async () => {
    const count = await User.count();
    if (count === 0) {
        const hash = bcrypt.hashSync('password123', 10);
        await User.create({ name: 'Admin', email: 'admin@neuzen.ai', password: hash, role: 'Admin' });
        await User.create({ name: 'HR', email: 'hr@neuzen.ai', password: hash, role: 'HR' });
        await User.create({ name: 'Employee', email: 'employee@neuzen.ai', password: hash, role: 'Employee' });
    }
    app.listen(PORT, () => console.log(`🚀 Admin-Ready Backend on ${PORT}`));
});

// --- ADMIN: EMPLOYEE MANAGEMENT & ROLE ASSIGNMENT ---

// Get all users with full details
app.get('/api/admin/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// Update User Role (Role Assignment Requirement)
app.patch('/api/admin/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        await User.update({ role }, { where: { id: req.params.id } });
        res.json({ success: true, message: "Role updated successfully" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete User (Employee Management Requirement)
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "User removed from system" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// System-wide Settings (Mock API for Requirement)
app.get('/api/admin/settings', (req, res) => {
    res.json({
        companyName: "NEUZEN AI",
        timezone: "IST",
        currency: "INR",
        maintenanceMode: false
    });
});