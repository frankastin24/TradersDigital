const ServicePreference = global.db.define('servicePreference', {
    id: {
        type: global.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    traderId: {
        type: global.Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    displayPrices: {
        type: global.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

export default ServicePreference;
