const cron = require("node-cron");
const appredis = require("../database/appredis");
const redisScan = require('redisscan');
const apphuggy = require('./thirdpartyapis/apphuggy');
const timeout = 10;
const appcron = module.exports = {};
const flowTimeout = '';

appcron.startRoutine = function(){
    cron.schedule('*/10 * * * *', () => {
        this.searchTimeout();
    });
};

appcron.searchTimeout = function () {
    redisScan({
        redis: appredis.client,
        pattern: '*lastMsgHour',
        keys_only: false,
        each_callback: function (type, key, subkey, length, value, cb) {
            console.log(key, value);
            let val = JSON.parse(value);
            let now = new Date().getTime();
            let chatID = val.split(':')[0];
            let msgTime = parseInt(val.split(':')[1]);
            let situation = val.split(':')[2];
            let department = val.split(':')[3] || 0;
            if(now - msgTime > timeout*60000 && situation === "auto"){
                apphuggy.startFlow(flowTimeout, chatID);
                appredis.delete(key);
            }
            cb();
        },
        done_callback: function (err) {
        }
    });
};
