/* 

HospCert V0.1

Copyright 2026 Fuseolution 
http://fuseolution.com

*/
const load = async () => {

    //Load environmentals

    global.__app_path = __dirname;
    require('./fuseo/enviromentals');

    //Initialize Database

    const { initializeDB } = require('./fuseo/db');

    await initializeDB();

    //Load Routes

    require('./routes')

    //Start Server

    require('./fuseo/server');

}

load();








