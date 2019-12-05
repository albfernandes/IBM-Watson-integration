const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.port || 3000;
const morgan = require('morgan');

const maioroute = require('./routes/main.route');
const financeroutes = require('./routes/finance.route');
const authmiddleware = require('./middleware/authmiddleware');
const financemiddleware = require('./middleware/financevalidation');

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(maybe(authmiddleware.autenticate));
app.use('/', maioroute);
app.use('/finances', financemiddleware.autenticate, financeroutes);

const server = app.listen(port, function () {
    let port = server.address().port;
    console.log('Online server at: '+port);
});

function maybe(fn) {
    return function(req, res, next) {
        if (req.path === '/msgFlow' || req.path === '/health') {
            next();
        } else {
            fn(req, res, next);
        }
    }
}

