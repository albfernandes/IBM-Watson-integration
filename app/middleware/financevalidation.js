const financevalidation = module.exports = {};
const jwtapp = require('../authentication/auth');
const financeapp = require('../services/finance/financeapp');

financevalidation.autenticate = async (req, res, next) => {
    try {
        let vat_number = req.body.hasOwnProperty('vat_number') ? req.body.vat_number : false;
        let companyId = req.body.hasOwnProperty('companyId') ? req.body.companyId : false;

        if(!vat_number)
            return res.status(200).json({variables: {message: "Malformed vat_number"}});

        let token = jwtapp.generateToken({
            "iss": "",
            "aud": "",
            "iat": "",
            "exp": "",
            "jti": "1",
            "companyId": 1
        });

        let params = {
            method: 'GET',
            endpoint: ``,
            token: token
        };

        let companyinfo = await financeapp.getInfo(params, companyId);
        companyinfo = JSON.parse(companyinfo);

        if(companyinfo.vat_number === "" || companyinfo.vat_number === null)
            return res.status(200).json({variables: {message: "Empty vat_number field"}});

        companyinfo.vat_number = companyinfo.vat_number.replace(/[^\d]/g, "");
        vat_number = vat_number.replace(/[^\d]/g, "");

        if(companyinfo.vat_number === vat_number)
            return next();

        return res.status(200).json({variables: {message: "Invalid data"}});

    }catch (e) {
        return res.status(400).json({error: e.message});
    }

};

