const request = require('request');
const financeapp = module.exports = {};

financeapp.getInfo = function (params, path){
    return new Promise((resolve, reject) => {
        request({
            method: params.method,
            url: params.endpoint + path,
            headers: {
                'Authorization': 'Bearer ' + params.token
            }
        }, function (error, response, body) {

            // console.log('Status:', response.statusCode);
            // console.log('Headers:', JSON.stringify(response.headers));
            // console.log('Response:', body);
            if(response.statusCode != 200 || error){
                return reject(body)
            }else{
                return resolve(body);
            }



        });
    });
};


