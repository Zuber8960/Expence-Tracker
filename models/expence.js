const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expence = sequelize.define('expence', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  amount: Sequelize.INTEGER,
  description: Sequelize.STRING,
  categary: Sequelize.STRING
});

module.exports = Expence;
