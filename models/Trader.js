const Trader = global.db.define('trader', {
    id: {
        type: global.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    passwordHash: {
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
    state: {
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
}); 

module.exports = Trader;