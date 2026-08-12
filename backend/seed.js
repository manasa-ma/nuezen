const sequelize = require('./config/db');
const User = require('./models/User');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // Resets the database file
    
    await User.bulkCreate([
      { name: 'Admin User', email: 'admin@neuzen.ai', password: 'password123', role: 'Admin' },
      { name: 'HR Manager', email: 'hr@neuzen.ai', password: 'password123', role: 'HR' },
      { name: 'Employee User', email: 'employee@neuzen.ai', password: 'password123', role: 'Employee' }
    ], { individualHooks: true });

    console.log("✅ Seed Success: Users created in SQLite!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();