const express = require('express');
const chatbotRouter = express.Router();
const dfff = require('dialogflow-fulfillment');

chatbotRouter.get('/', (req, res) =>{
    res.send("hello")
});


chatbotRouter.post('/', express.json(), (req, res) =>{
    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });

    function demo(agent){
        agent.add("Send reponse from webhook server")
    }

    var intentMap = new Map();

    intentMap.set('webhooktest', demo)  
    agent.handleRequest(intentMap);
});
module.exports = chatbotRouter;