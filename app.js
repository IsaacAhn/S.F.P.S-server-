const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.js');

// routes
const mms = require('./routes/mms');
const fcm = require('./routes/fcm');

// midleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('static'));
app.use('/mms', mms);
app.use('/fcm', fcm);

app.listen(config.PORT, function(){
   console.log(`Server Running ${config.PORT} Port!`);
});
