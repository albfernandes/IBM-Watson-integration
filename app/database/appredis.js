const redisPort = process.env.REDIS_PORT || 6379,
    redisHost = process.env.REDIS_HOST || '127.0.0.1',
    redisAuth = process.env.REDIS_AUTH || null,
    redis = require('redis');

const client = redis.createClient(redisPort, redisHost, {
    auth_pass: redisAuth
});

const appredis = module.exports = {};

appredis.client = client;

client.on('error', function(err){
    console.log('Something went wrong on redis client', err)
});

appredis.insert = function(key, value, time){
    client.set(key, value, 'EX', time);
};

appredis.select = function (key){
    return new Promise((resolve, reject) => {
        client.get(key, function (error, result) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(JSON.parse(result));
            }
        });
    });
};

appredis.delete = function (key){
    client.del(key, function(err, response) {
        if (response == 1) {
            console.log(key+", deleted Successfully!")
        } else{
            console.log("Cannot delete key: "+key)
        }
    })
};

appredis.flushall = function (){
    return new Promise((resolve, reject) => {
        client.flushdb( function (err, succeeded) {
            if(succeeded){
                console.log(succeeded);
                resolve(succeeded); // will be true if successfull
            }
            else
                reject('error with flushdb');
        });
    });
};