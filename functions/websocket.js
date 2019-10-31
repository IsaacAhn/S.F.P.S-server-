module.exports = {
  send: send
}

var WebSocketClient = require('websocket').client;


var client = new WebSocketClient();
client.connect('ws://58.127.197.205:7647/websocket');


var conn;
var id;

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
  conn = connection;
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
    conn = null;
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log("Received: '" + message.utf8Data + "'");
    }
  });
});



function send(object) {
    /*

      id : 0 센서데이터
      1 opencv데이터
      2 텐서플로우 데이터

    */
    var str;
    if (object.id == '0') {
      str = JSON.stringify({
        id: '0',
        location: '부평역',
        data: {
          location: object.location,
          temperature: object.temperature,
          smoke: object.smoke,
          flame: object.flame,
          flame_number: object.flame_number,
          date: getDateStamp(),
          time: getTimeStamp()
        },
        lat: "37.4523700",
        lng: "126.6326050"
      });
    } else if (object.id == '1') {
      str = JSON.stringify({
        id: '1',
        location: '부평역',
        data: {
          location: object.location,
          result: object.result,
          filepath: object.filepath,
          date: getDateStamp(),
          time: getTimeStamp()
        },
        streamurl: object.streamurl,
        lat: "37.4523700",
        lng: "126.6326050"
      });
    }
    conn.sendUTF(str);

}

function getDateStamp() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2);

  return s;
}

function getTimeStamp() {
  var d = new Date();
  var s =
    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}
