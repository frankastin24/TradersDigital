const Sequelize = require('sequelize')
const Trader = global.db.define('trader', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: Sequelize.STRING,
        allowNull: true
    },

    package : {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    billing : {
        type: Sequelize.STRING,
        allowNull: false
    },

    regComplete: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        default: false
    },

    facebookId: {
        type: Sequelize.INTEGER,
        allowNull:true
    },

    googleId: {
        type: Sequelize.INTEGER,
        allowNull:true
    },

    appleId: {
        type: Sequelize.INTEGER,
        allowNull:true
    },

    businessName: {
        type: Sequelize.STRING,
          allowNull: true
    },

    trade: {
        type: Sequelize.STRING,
          allowNull: true
    },

    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },

    city: {
        type: Sequelize.STRING,
        allowNull: true
    },

    county: {
        type: Sequelize.STRING,
        allowNull: true
    },
    
    experience : {
        type: Sequelize.STRING,
        allowNull: true
    },
    areas : {
        type: Sequelize.STRING,
        allowNull: true
    },
    services : {
        type: Sequelize.STRING,
        allowNull: true
    },

    trailEndsAt : {
        type: Sequelize.DATE,
        allowNull: true
    },

    totalPaymentsAmount : {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    lastPaymentMade : {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        default:false
    },
    todoList : {
        type: Sequelize.TEXT,
        default: '["template","domain","services","base"]',
    },
    stripeCustomer : {
        type: Sequelize.STRING,
        allowNull: true
    },
    stripeSubscription : {
        type: Sequelize.STRING,
        allowNull: true
    },
}); 
global.db.sync();
module.exports = Trader;