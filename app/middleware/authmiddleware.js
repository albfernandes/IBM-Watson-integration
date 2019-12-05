const authmiddleware = module.exports = {};
const jwt = require('jsonwebtoken');
const authconfig = require('../config/authconfig');
const appslack = require('../services/thirdpartyapis/appslack');

authmiddleware.autenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        //appslack.send(`Invalid request: no token provided\n${JSON.stringify(req.headers)}\n route: ${req.originalUrl}\nbody: ${JSON.stringify(req.body)}`);
        return res.status(401).send({error: 'No token provided'});
    }

    const parts = authHeader.split(' ');

    if(!(parts.length === 2)){
        appslack.send(`Invalid request: Token error\n${JSON.stringify(req.headers)}\n route: ${req.originalUrl}\nbody: ${JSON.stringify(req.body)}`);
        return res.status(401).send({error: 'Token error'});
    }

    const [ scheme, token ] = parts;

    if(!(/^Bearer$/).test(scheme)){
        appslack.send(`Invalid request: Token malformatted\n${JSON.stringify(req.headers)}\n route: ${req.originalUrl}\nbody: ${JSON.stringify(req.body)}`);
        return res.status(401).send({error: 'Token malformatted'});
    }


    jwt.verify(token, authconfig.higgor_token, (err, decoded) => {
        if(err){
            appslack.send(`Invalid request: Invalid token\n${JSON.stringify(req.headers)}\n route: ${req.originalUrl}\nbody: ${JSON.stringify(req.body)}`);
            return res.status(401).send({error: 'Invalid token'});
        }

        return next();
    })

};

