import router from './fuseo/routing.js';
import TradersDigital from './controllers/TradersDigital.js';
import API from './controllers/Api.js';
import TraderWebsite from './controllers/TraderWebsite.js';

router.get(`/`, TradersDigital.home)

router.get(`/sign-up`, TradersDigital.signup)
router.get(`/generate-website`, TradersDigital.buildSite)
router.get(`/dash`, TradersDigital.dashboard)
router.get(`/super`, TradersDigital.super)
router.get(`/payment/[plan]/[interval]`, TradersDigital.payment)
router.post(`/client-secret`, TradersDigital.clientSecret)
router.get('/return', TradersDigital.return)
router.get('/trader/[url]', TraderWebsite.home);

router.post('/api/create-user',API.createUser)
router.post('/api/set-password',API.setPassword)

router.post('/api/set-trade',API.setTrade)
router.post('/api/set-name',API.setName)
router.post('/api/set-details',API.setDetails)
router.post('/api/set-about', API.setAbout)

router.post('/api/delete-trader', API.deleteUser);

router.get('/api/dashboard', API.dashboard)
router.get('/api/customers', API.listCustomers)
router.post('/api/customers', API.createCustomer)
router.get('/api/jobs', API.listJobs)
router.post('/api/jobs/[id]/status', API.updateJobStatus)
router.post('/api/jobs/[id]/date', API.updateJobDate)
router.post('/api/settings/email', API.updateEmail)
router.post('/api/settings/password', API.updatePassword)
router.get('/api/services', API.listServices)
router.post('/api/services', API.createService)
router.post('/api/services/[id]', API.updateService)
router.post('/api/services/[id]/delete', API.deleteService)
router.post('/api/services/preferences', API.updateServicePreference)

 