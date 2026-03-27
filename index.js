/* 

HospCert V0.1

Copyright 2026 Fuseolution 
http://fuseolution.com

*/
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDB } from './fuseo/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const load = async () => {

    //Load environmentals

    global.__app_path = __dirname;
    await import('./fuseo/enviromentals.js');

    //Initialize Database

    await initializeDB();

    // Register models before syncing
    await import('./models/Trader.js');
    await import('./models/Website.js');
    await import('./models/Customer.js');
    await import('./models/Job.js');
    await import('./models/Service.js');
    await import('./models/ServicePreference.js');
    await import('./models/QuoteRequest.js');

    // Sync missing tables/columns safely (no alter)
    await global.db.sync();

    //Load Routes

    await import('./routes.js');

    //Start Server

    await import('./fuseo/server.js');

}

load();








