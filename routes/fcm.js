const express = require('express');
const router = express.Router();
const config = require('../config.js');
const FCM = require('fcm-push');

router.get('/', function(req, res){
  var fcm = new FCM(config.FIREBASE_SERVERKEY);
  var message = {
        to: config.Token,
        notification: {
            title: 'title',
            body: 'body'
        }
    };

    fcm.send(message)
        .then(function(response){
            //console.log("Successfully sent with response: ", response);
            console.log('send Successfully');
        })
        .catch(function(err){
            console.error(err);
        })
});

module.exports = router;
