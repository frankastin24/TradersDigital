const router = require('./fuseo/routing');
const TradersDigital = require('./controllers/TradersDigital');

const adminURL = global.__env.ADMIN_URL;

router.get(`/`, TradersDigital.home)
router.get(`/sign-up`, TradersDigital.signup)

 