const express = require('express');
const router = express.Router();
const config = require('../config.js');
const accountSid = config.accountSid;
const authToken = config.authToken;
const client = require('twilio')(accountSid, authToken);

router.get('/', function(req, res){
  client.messages
    .create({
       body: '스마트 화재 예방 서비스 MMS 테스트',
       from: config.Twilio_NUMBER,
       mediaUrl: config.Address + 'externalFile.jpg',
       to: config.My_NUMBER
     })
    .then(message => console.log(message.sid));
});

module.exports = router;
