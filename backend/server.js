const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');
const SECRET = 'neuzen_secret';

// Helper functions
const getData = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const saveData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Initialize Database
if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    saveData({
        users: [
            { id: 1, name: 'System Admin', email: 'admin@neuzen.ai', password: bcrypt.hashSync('password123', salt), role: 'Admin' },
            { id: 2, name: 'HR Manager', email: 'hr@neuzen.ai', password: bcrypt.hashSync('password123', salt), role: 'HR' },
            { id: 3, name: 'John Employee', email: 'employee@neuzen.ai', password: bcrypt.hashSync('password123', salt), role: 'Employee' }
        ],
        leaves: [],
        attendance: []
    });
}

// AUTH API
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const { users } = getData();
    const user = users.find(u => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
        return res.json({ ...user, token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

// LEAVES API
app.get('/api/leaves', (req, res) => res.json(getData().leaves));
app.post('/api/leaves', (req, res) => {
    const data = getData();
    const newLeave = { id: Date.now(), ...req.body, status: 'Pending' };
    data.leaves.push(newLeave);
    saveData(data);
    res.json(newLeave);
});
app.patch('/api/leaves/:id', (req, res) => {
    const data = getData();
    const index = data.leaves.findIndex(l => l.id == req.params.id);
    if (index > -1) {
        data.leaves[index].status = req.body.status;
        saveData(data);
        res.json(data.leaves[index]);
    }
});

// ATTENDANCE API
app.get('/api/attendance', (req, res) => res.json(getData().attendance));
app.post('/api/attendance', (req, res) => {
    const data = getData();
    data.attendance.push({ id: Date.now(), ...req.body });
    saveData(data);
    res.json({ message: "Attendance Marked" });
});

// USER MANAGEMENT (ADMIN)
app.get('/api/users', (req, res) => res.json(getData().users));

app.listen(5000, () => console.log('🚀 Backend running on port 5000'));