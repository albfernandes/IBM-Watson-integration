const watson = require('watson-developer-cloud/index');

const assistant = new watson.AssistantV1({
    version: '2018-09-20',
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    url: 'https://gateway.watsonplatform.net/assistant/api/'
});

const appwatson = module.exports = {};

appwatson.sendTo = function (txt, context) {
    return new Promise((resolve, reject) => {
        assistant.message({
            workspace_id: process.env.WATSON_WORKSPACE_ID,
            input: {'text': txt},
            context: context,
            alternate_intents: true
        }, async function (err, response) {
            if (err){
                console.log('error send to watson:', err);
                //appslack.send('Watson error: '+err+', Input: '+txt);
                reject('Watson error: '+err);
            }
            else {
                let outwatson = response.output.text[0];

                for (let i = 1; i < response.output.text.length; i++){
                    outwatson = outwatson+" ~ "+ response.output.text[i];
                }

                response.outwatson = outwatson;
                //console.log('Visão do watson: '+response.input.text);
                resolve(response);
            }
        });
    });
};
