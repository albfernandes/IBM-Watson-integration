const mainRoute = require('express').Router();
const watsonController = require('../controllers/watsonController');
const redisController = require('../controllers/redisController');

mainRoute.post('/', watsonController.ask);

mainRoute.post('/msgFlow', watsonController.webhookHandler);

mainRoute.post('/msg', watsonController.saveMessage);

mainRoute.post('/flush', redisController.flushDb);

mainRoute.post('/teste', watsonController.directTest);

mainRoute.get('/health', async (req, res) => {
    res.status(200).send('ok');
});

module.exports = mainRoute;
