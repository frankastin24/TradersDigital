const Customer = global.db.define('customer', {
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
    }
});