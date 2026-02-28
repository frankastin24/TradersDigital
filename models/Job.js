const Job = global.db.define('Job', {
    id: {
        type: global.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: global.Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: global.Sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: global.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    scheduledDate: {
        type: global.Sequelize.DATE,
        allowNull: true
    },
    durationDays: {
        type: global.Sequelize.INTEGER,
        allowNull: true
    },
    price: {
        type: global.Sequelize.FLOAT,
        allowNull: true
    }
});