const QuoteRequest = global.db.define('QuoteRequest', {
    id: {
        type: global.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerID: {
        type: global.Sequelize.INTEGER,
        allowNull: false
    },
    jobDescription : {
        type: global.Sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: global.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
    }
});

export default QuoteRequest;