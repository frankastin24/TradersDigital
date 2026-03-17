const router = require('./fuseo/routing');
const TradersDigital = require('./controllers/TradersDigital');
const API = require('./controllers/Api')

router.get(`/`, TradersDigital.home)

router.get(`/sign-up`, TradersDigital.signup)
router.get(`/build-website`, TradersDigital.buildSite)
router.get(`/super`, TradersDigital.super)
router.get(`/payment/[plan]/[interval]`, TradersDigital.payment)
router.post(`/client-secret`, TradersDigital.clientSecret)
router.get('/return', TradersDigital.return)

router.post('/api/create-user',API.createUser)
router.post('/api/set-password',API.setPassword)

router.post('/api/set-trade',API.setTrade)
router.post('/api/set-name',API.setName)
router.post('/api/set-details',API.setDetails)
router.post('/api/set-about', API.setAbout)

router.get('/api/delete-trader', API.deleteUser);

 