const { Sequelize } = require('sequelize');

// This creates a file named 'database.sqlite' in your backend folder
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

module.exports = sequelize;