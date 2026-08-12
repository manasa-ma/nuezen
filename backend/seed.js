const sequelize = require('./config/db'); // or just import from server.js logic
const bcrypt = require('bcryptjs');
// Create a temporary User model for seeding
const { DataTypes } = require('sequelize');
const User = sequelize.define('User', {
  name: DataTypes.STRING, email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING, role: DataTypes.STRING
});

const seed = async () => {
  await sequelize.sync({ force: true });
  const pass = bcrypt.hashSync('password123', 10);
  
  await User.bulkCreate([
    { name: 'System Admin', email: 'admin@neuzen.ai', password: pass, role: 'Admin' },
    { name: 'HR Manager', email: 'hr@neuzen.ai', password: pass, role: 'HR' },
    { name: 'John Employee', email: 'employee@neuzen.ai', password: pass, role: 'Employee' }
  ]);
  
  console.log("✅ SQLite Seeded! Use 'password123' to login.");
  process.exit();
};
seed();