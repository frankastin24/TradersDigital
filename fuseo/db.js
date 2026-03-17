const { Sequelize } = require('sequelize');

const initializeDB = async () => {
  console.log(global.__env.DB_HOSTNAME);
  console.log(global.__env.DB_USERNAME);
  console.log(global.__env.DB_PASSWORD);
  sequelize = new Sequelize({
     dialect: 'mysql',
     host: global.__env.DB_HOSTNAME,
     username: global.__env.DB_USERNAME,
     password: global.__env.DB_PASSWORD,
     database: global.__env.DB_NAME,
    logging: false,  
  });

  try {
    await sequelize.authenticate();
    global.db = sequelize;
    console.log('Database connection has been established successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
   
  }

  

}



module.exports = {initializeDB};

