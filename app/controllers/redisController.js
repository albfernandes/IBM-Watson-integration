const appredis = require("../database/appredis");
const Sentry = require('@sentry/node');
Sentry.init({ dsn: require('../config/general.config').sentry_dsn });
const redisController = module.exports = {};

redisController.flushDb = function (req, res){
    try{
        if(req.body.token === process.env.HUGGY_API_KEY){
            appredis.flushall();
            return res.status(200).send('OK');
        }else{
            res.status(200).send('Invalid token to flushdb');
        }
    }catch(e){
        Sentry.captureEvent(e);
        return res.status(400).json(e.message);
    }
};