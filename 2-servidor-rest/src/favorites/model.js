const Sequelize = require('sequelize');
const database = require('../database');
 
const Favorite = database.define('favorites', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    memeId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
});


 
module.exports = Favorite;