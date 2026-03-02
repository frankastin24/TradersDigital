const Trader = global.db.define('trader', {
    id: {
        type: global.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    facebookId: {
        type: global.Sequelize.INTEGER,
        allowNull:true
    },

    name: {
        type: global.Sequelize.STRING,
        allowNull: false
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

    businessName: {
        type: global.Sequelize.STRING,
        allowNull: false
    },

    businessType: {
        type: global.Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: global.Sequelize.STRING,
        allowNull: true
    },
    address: {
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
    zipCode: {
        type: global.Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: global.Sequelize.STRING,
        allowNull: true
    },
    template: {
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
        allowNull: true
    },
    todoList : {
        type: global.Sequelize.TEXT,
        default: '["template","domain","services","base"]',
    },
    registrationComplete :{
        type: global.Sequelize.BOOLEAN,
        default: false
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