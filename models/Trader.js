const Trader = global.db.define('trader', {
    id: {
        type: global.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: global.Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: global.Sequelize.STRING,
        allowNull: false
    },

    regComplete: {
        type: global.Sequelize.BOOLEAN,
        allowNull: false
    },

    facebookId: {
        type: global.Sequelize.INTEGER,
        allowNull:true
    },

    googleId: {
        type: global.Sequelize.INTEGER,
        allowNull:true
    },

    appleId: {
        type: global.Sequelize.INTEGER,
        allowNull:true
    },

    businessName: {
        type: global.Sequelize.STRING,
        allowNull: false
    },

    trade: {
        type: global.Sequelize.STRING,
        allowNull: false
    },

    phoneNumber: {
        type: global.Sequelize.STRING,
        allowNull: true
    },

    city: {
        type: global.Sequelize.STRING,
        allowNull: true
    },

    county: {
        type: global.Sequelize.STRING,
        allowNull: true
    },
    
    about: {
        type: global.Sequelize.TEXT,
        allowNull: true
    },

    trailEndsAt : {
        type: global.Sequelize.DATE,
        allowNull: true
    },

    totalPaymentsAmount : {
        type: global.Sequelize.FLOAT,
        allowNull: true
    },
    lastPaymentMade : {
        type: global.Sequelize.BOOLEAN,
        allowNull: true,
        default:false
    },
    todoList : {
        type: global.Sequelize.TEXT,
        default: '["template","domain","services","base"]',
    },
    stripeCustomer : {
        type: global.Sequelize.STRING,
        allowNull: true
    },
    stripeSubscription : {
        type: global.Sequelize.STRING,
        allowNull: true
    },
}); 

module.exports = Trader;