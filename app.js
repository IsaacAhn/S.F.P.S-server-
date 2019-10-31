var fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.js');


// routes
const control = require('./routes/control');

// midleware
app.use(express.static('pictures'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('static'));
app.use('/control', control);

app.listen(config.PORT, function() {
  console.log(`Server Running ${config.PORT} Port!`);
});
