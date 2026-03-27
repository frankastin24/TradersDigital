import Sequelize from 'sequelize';
const Website = global.db.define('website', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    traderId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    template: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    aboutUs: {
        type: Sequelize.TEXT,
         allowNull: true
    },
    logo : {
        type: Sequelize.STRING,
         allowNull: true
    },
    heroImage : {
        type: Sequelize.STRING,
         allowNull: true
    },
    aboutImage : {
        type: Sequelize.STRING,
         allowNull: true
    },
    colorScheme : {
        type: Sequelize.STRING,
         allowNull: true
    },
    font : {
        type: Sequelize.STRING,
         allowNull: true
    },

}); 
export default Website;