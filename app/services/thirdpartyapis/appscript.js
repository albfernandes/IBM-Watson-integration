const request = require('request');
const urlscript = '';
const appscript = module.exports = {};
const appslack = require("./appslack");

appscript.send = function(json){
        request({
            method: 'POST',
            url: urlscript,
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        }, function (error, response, body) {
            if(response.statusCode >= 400)
                appslack.send('Script API status: '+response.statusCode+'. Input: '+json.input);
            //console.log('Status:', response.statusCode);
            // console.log('Headers:', JSON.stringify(response.headers));
            //console.log('Response:', body);

        });
};
