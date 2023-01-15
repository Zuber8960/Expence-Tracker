const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Filedownloaded = sequelize.define('filedownloaded', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  fileURL : Sequelize.STRING
});

module.exports = Filedownloaded;
