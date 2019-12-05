const appwatson = require('../services/thirdpartyapis/watson');
const apphuggy = require('../services/thirdpartyapis/apphuggy');
const appredis = require("../database/appredis");
const appscript = require("../services/thirdpartyapis/appscript");
const appslack = require("../services/thirdpartyapis/appscript");
const Sentry = require('@sentry/node');
const webhooktoken = require('../config/general.config').huggy_webhook;
let patternST = /\[([a-z]*|\_*|\-*|\d*)*\]/;
let patternJSON = /vrb/g;
Sentry.init({ dsn: require('../config/general.config').sentry_dsn});

const watsonController = module.exports = {};

watsonController.ask = async function (req, res){
    try{
        let text = req.body.text || "";
        text = text.replace(/\r?\n|\r/g, " ");
        console.log("Input: "+text);

        let context = await appredis.select(req.body.chatID) || {};

        if(req.body.hasOwnProperty('nome')){
            appredis.insert(req.body.chatID + 'nome', JSON.stringify(req.body.nome), 900);
        }

        if(req.body.hasOwnProperty('email')){
            appredis.insert(req.body.chatID + 'email', JSON.stringify(req.body.email), 900);
        }

        if(req.body.hasOwnProperty('huggycontext')){
            let huggycontext = req.body.huggycontext || {};
            context = Object.assign(context, huggycontext);
        }

        if (req.body.hasOwnProperty('flagBD') && req.body.flagBD === 'yes') {
            text = await appredis.select(req.body.chatID + "msg") || text;
        }

        let response = await appwatson.sendTo(text, context);
        for (let i = 0; i < response.output.text.length; i++){
            if(response.output.text[i].includes('[CLIENTE_PRIMEIRO_NOME]')){
                let nome = await appredis.select(req.body.chatID + "nome") || '';
                response.output.text[i] = response.output.text[i].replace('[CLIENTE_PRIMEIRO_NOME]', nome);
            }
        }

        let request = {
            intents: response.intents,
            input: response.input.text,
            outwatson: response.outwatson,
            chatID: req.body.chatID,
            email: await appredis.select(req.body.chatID + "email") || "",
            context: JSON.stringify(context)
        };

        appscript.send(JSON.stringify(request));
        appredis.insert(req.body.chatID, JSON.stringify(response.context), 900);

        for (let i = 0; i < response.output.text.length; i++){
            if(patternJSON.test(response.output.text[i])){
                response.output.text[i] = response.output.text[i].replace(patternJSON, '');
                let values = response.output.text[i].split(',');
                let obj = {};
                for(let j = 0; j < values.length; j++){
                    obj[`key${j}`] = values[j];
                }
                return res.status(200).json({variables: obj});
            }
        }

        if(patternST.test(response.outwatson)){
            apphuggy.sendLoop(response.output.text, req.body.chatID);
        }else{
            apphuggy.sendLoop(response.output.text, req.body.chatID);
            apphuggy.startFlow(34386, req.body.chatID); // executa o flow de loop
        }

        return res.status(200).send(response.output.text);

    }catch(e){
        Sentry.captureEvent(e);
        console.log(e);
        appslack.send(e);
        return res.status(400).send(e);
    }
};

watsonController.webhookHandler = async function (req, res){
    try {

        if (typeof (req.body.messages) == "undefined" && typeof (req.body.text) == "undefined" || req.body == "") {
            return res.status(200).send(webhooktoken);

        } else if (req.body.messages.hasOwnProperty('receivedAllMessage')) {
            //console.log(req.body.messages.receivedAllMessage[0].chat);
            if (req.body.messages.receivedAllMessage[0].receiverType === "agent" && req.body.messages.receivedAllMessage[0].channel !== "email") {
                console.log('Entered in timeout queue: ' + req.body.messages.receivedAllMessage[0].chat.id);
                let lastMsgHour = new Date().getTime();
                appredis.insert(req.body.messages.receivedAllMessage[0].chat.id + 'lastMsgHour', JSON.stringify(req.body.messages.receivedAllMessage[0].chat.id + ':' + lastMsgHour + ':' + req.body.messages.receivedAllMessage[0].chat.situation + ':' + req.body.messages.receivedAllMessage[0].chat.department), 6000);
            }

            return res.status(200).send(webhooktoken);

        } else if (req.body.messages.hasOwnProperty('agentEntered')) {
            console.log('Agent entered');
            let lastMsgHour = new Date().getTime();
            appredis.insert(req.body.messages.agentEntered[0].id + 'lastMsgHour', JSON.stringify(req.body.messages.agentEntered[0].id + ':' + lastMsgHour + ':' + req.body.messages.agentEntered[0].situation + ':' + 0), 6000);
            return res.status(200).send(webhooktoken);

        } else if (req.body.messages.hasOwnProperty('closedChat')) {
            console.log('closed chat: '+req.body.messages.closedChat[0].id);
            let lastMsgHour = new Date().getTime();
            appredis.insert(req.body.messages.closedChat[0].id + 'lastMsgHour', JSON.stringify(req.body.messages.closedChat[0].id + ':' + lastMsgHour + ':' + "finished" + ':' + 0), 6000);
            return res.status(200).send(webhooktoken);
        }

    }catch(e){
        Sentry.captureEvent(e);
        console.log(e);
        return res.status(400).send(e);
    }

};

watsonController.saveMessage = function (req, res){
    appredis.insert(req.body.chatID+"msg", JSON.stringify(req.body.text), 600);
    return res.status(200).send('ok');
};

watsonController.directTest = async function (req, res) {
    let response = await appwatson.sendTo(req.body.text, {});
    return res.status(200).send(response);
};

