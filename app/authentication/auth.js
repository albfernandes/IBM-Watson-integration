const jwt = require('jsonwebtoken');
const jwtapp = module.exports = {};
const authconfig = require ('../config/authconfig');

jwtapp.generateToken = function(params){
    return jwt.sign(params, authconfig.finance_secret, {
        algorithm : 'HS256'
    });
};
