module.exports = {
  send: send
};

// var request = require("request");
var io = require('socket.io-client');
var dl = require('delivery');
var config = require('../config.js');
var test = require('./test.js');
var socket = io.connect("http://" + config.address + ":" + config.PORT, {
  reconnection: true
});
var k = 0;
var delivery = dl.listen(socket);
delivery.connect();

socket.on('connect', function() {
  console.log("Sockets connected");

  socket.on('sendData', function(msg) {
    console.log('result : ' + msg);
    data(msg);
    test.receive(msg);
  });
});

function send(opencvTime, l) {
  console.log('Image send to server');

  delivery.send({
    name: 'FireImage.jpg',
    path: './pictures/' + opencvTime + '.jpg'
  });
}
