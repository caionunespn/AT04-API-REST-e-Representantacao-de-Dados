const Sequelize = require('sequelize');
const database = require('../database');
 
const Meme = database.define('memes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    externalId: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
});


 
module.exports = Meme;