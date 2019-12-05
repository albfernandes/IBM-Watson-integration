const routes = require('express').Router();
const financeController = require('../controllers/financeController');

routes.post('/invoices', financeController.listinvoices);

routes.post('/subscriptions', financeController.subcriptionInfo);

module.exports = routes;