const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.TEXT,
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  passward: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isPremiumUser: Sequelize.BOOLEAN
});

module.exports = User;
