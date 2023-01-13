const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const forgotPassward = sequelize.define('forgotpassward' , {
    id : {
        type : Sequelize.UUID,
        allowNull : false,
        primaryKey : true,
    },
    isActive : Sequelize.BOOLEAN,
})

module.exports = forgotPassward;