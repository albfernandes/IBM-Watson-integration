const request = require('request');
const urlwebhookSlack = require ('../../config/general.config').slack_webhook;
let appslack = module.exports = {};

appslack.send  = function(text){
    request({
        method: 'POST',
        url: urlwebhookSlack,
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify({text: text})
    }, function (error, response, body) {
        //console.log('Status slack API:', response.statusCode);
        //console.log('Headers:', JSON.stringify(response.headers));
        // console.log('Response:', body);
    });

};
