const request = require('request');
const apikey = process.env.HUGGY_API_KEY;

const apphuggy = module.exports = {};
const appslack = require("./appslack");

apphuggy.sendTo  = function(txt, chatID, i){
    if( i < txt.length) {
        request({
            method: 'POST',
            url: 'https://api.huggy.io/v2/chats/' + chatID + '/messages',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': 'Bearer '+apikey
            },
            body: JSON.stringify({text: txt[i]})
        },function (error, response, body) {
            if(response.statusCode >= 400)
                appslack.send(`Huggy API message status: ${response.statusCode}, corpo: ${body}, chatID: ${chatID}`);
            console.log('Status msg:', response.statusCode);
            //console.log('Response msg:', body);
            i++;
            apphuggy.sendTo (txt, chatID, i);
        });
    }
};

apphuggy.startFlow = function(idFlow, chatID){
    request({
        method: 'POST',
        url: 'https://api.huggy.io/v2/chats/'+chatID+'/flow',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': 'Bearer '+apikey
        },
        body: JSON.stringify({flowId: idFlow})
        }, function (error, response, body) {
        console.log('Status flow:', response.statusCode);
        if(response.statusCode >= 400){
            appslack.send(`Huggy API flow: ${response.statusCode}, idFlow: ${idFlow}, chatID: ${chatID}, corpo: ${body}`);
            //appslack.send( 'Huggy API flow status: '+JSON.stringify(response.headers));
        }
        //console.log('Headers:', JSON.stringify(response.headers));
       // console.log('Response:', body);
    });
};

apphuggy.sendLoop = function(txt, chatID){
    apphuggy.sendTo(txt, chatID, 0);
};
