const Service = global.db.define('service', {
    id: {
        type: global.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    traderId: {
        type: global.Sequelize.INTEGER,
        allowNull: false
    },
    name: {
        type: global.Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: global.Sequelize.TEXT,
        allowNull: true
    },
    minPrice: {
        type: global.Sequelize.FLOAT,
        allowNull: true
    },
    maxPrice: {
        type: global.Sequelize.FLOAT,
        allowNull: true
    },
    featured: {
        type: global.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

export default Service;
