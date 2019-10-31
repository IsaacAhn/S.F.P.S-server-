const express = require('express');
const bodyParser = require('body-parser');
const cmd = require('node-cmd');
const schedule = require('node-schedule');
const router = express.Router(); //라우터 레벨 미들웨어
const SerialPort = require('serialport')
const config = require('../config.js'); // config 파일 불러오기
const mms = require('./mms');
const websocket = require('../functions/websocket');
var ps = require('ps-node');
const tensorflow = require('../functions/tensor');
const test = require('../functions/test');

const port = new SerialPort(config.serialPort, {
  baudRate: 9600
});
const motor = new SerialPort(config.serialPort2, {
  baudRate: 9600
});

var Readline = SerialPort.parsers.Readline
var parser = new Readline()
port.pipe(parser)

var webSend;
var opencvTime;
var opencvResult;
var tensorTime;
var tensorResult;
var numTotal;
var flameData = new Array();
var flameLocation;
var cvControl = 0;
var humidity;
var flame;
var temperature;
var smoke;
var object;
var motorSignal;
var turn = 0;
var a;

port.on('open', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message);
  }
  console.log('Port is opend . . .');
});

port.on('error', function(err) {
  console.log('Error: ', err.message);
});

parser.on('data', function(data) {
  try {
    humidity = 0;
    flame = 1000;
    temperature = 0;
    smoke = 0;
    //tensorResult = tensorflow.data();

    tensorResult = test.reture();
    var str = JSON.stringify(data); // JSON객체를 String 객체로 변환
    var datastr = JSON.parse(data); //String 객체를 JSON객체로 변환
    flameData[0] = datastr.Flame1;
    flameData[1] = datastr.Flame2;
    flameData[2] = datastr.Flame3;
    flameData[3] = datastr.Flame4;
    humidity = datastr.Humidity;
    temperature = datastr.Temperature;
    smoke = datastr.Smoke;
    motorSignal = datastr.motorSignal;
    sensorSend();

    if (turn == 0) {
      if (numTotal >= 1) {
        if (cvControl == 0) {
          write0();
          turn = 1;
          cvControl = 1;
          processOpencv();
        }
      }
    }

    if (motorSignal == 9) {
      cvControl == 0;
      console.log("Opencv Not Detected");
      setTimeout(function() {
        if (webSend != 1) {
          opencvStop();
          opencvSend();
        }
      }, 2000);
    }

    if (webSend == 1) {
      write1();
      opencvSend();
      opencvResult = '';
    }
    if (tensorResult == 'Y') {
      write2();
      cvControl = 0;
      turn = 0;
      test.reset();
    } else if (tensorResult == 'N') {
      cvControl = 0;
      turn = 0;
      test.reset();
    }
  } catch (e) {
    console.log("Couldn't receive sensor data: ", e);
  }
});

//************************sensor값 처리************************//
function sensorSend() {
  var tempHumiNum = 0;
  var flmaeNum = 0;
  var smokeNum = 0;
  numTotal = 0;

  for (var i = 0; i < 4; i++) {
    if (flame == null) {
      flame = flameData[0]
    } else if (flame > flameData[i]) {
      flame = flameData[i];
      flameLocation = i + 1;
    }
  }
  if (flame != null && humidity != null && temperature != null && smoke != null) {
    object = {
      id: '0',
      location: "부평역",
      temperature: temperature,
      flame: flame,
      smoke: smoke,
      flame_number: flameLocation
    };
    websocket.send(object);
  } else {
    console.log("NULL");
  }

  if (temperature > 50 || humidity < 20) {
    tempHumiNum = 1;
  } else {
    tempHumiNum = 0;
  }
  if (flame < 300) {
    flameNum = 1;
  } else {
    flameNum = 0;
  }
  if (smoke > 210) {
    smokeNum = 1;
  } else {
    smokeNum = 0;
  }
  numTotal = tempHumiNum + flameNum + smokeNum;
}

//************************opencv데이터 전송, tensor실행************************//
function opencvSend() {
  if (opencvResult == 'Y') {
    mms.send(opencvTime);
    tensorflow.send(opencvTime, 0);
    object = null;
    object = {
      id: '1',
      location: "부평역",
      result: "Y",
      filepath: "http://58.127.197.205:3000/" + opencvTime + ".jpg",
      streamurl: "http://58.127.197.205:8081/?action=stream"
    };
  } else {
    object = null;
    object = {
      id: '1',
      location: "부평역",
      result: "N",
      filepath: "X",
      streamurl: "X"
    };
    cvControl = 0;
  }
  webSend = 0;
  turn = 0;
  websocket.send(object);
}

//************************opencv 실행************************//
function processOpencv() {
  console.log("Sensor Detect");
  cmd.get(
    "node /home/pi/Desktop/S.F.P.S-server-/functions/command.js",
    function(error, success, stderr) {
      if (error) {
        console.log("ERROR 발생 :\n\n", error);
      } else {
        console.log("SUCCESS :\n\n", success);
      }
    }
  );
}

//************************command.js kill************************//
function opencvStop() {
  ps.lookup({
    command: 'node',
    arguments: 'command',
  }, function(err, resultList) {
    if (err) {
      throw new Error(err);
    }

    resultList.forEach(function(process) {
      if (process) {
        ps.kill(process.pid, function(err) {
          if (err) {
            throw new Error(err);
          }
        });
      }
    });
  });
}

//************************opencv데이터 수신************************//
router.post('/', function(req, res) {
  opencvTime = req.body.time;
  webSend = req.body.send;
  opencvResult = req.body.result;
  // tensorResult = req.body.tensordata;
  // if(err){
  //   console.log(err);
  //   connection.release();
  //   return;
  // }
});

function write0() {
  motor.write("0");
  console.log("Camera Activated")
}

function write1() {
  motor.write("1");
  console.log("Camera Stopped")
}

function write2() {
  motor.write("2");
  console.log("Start Fire Extinguish")
}

// router.post('/', function(req, res) {
//   var position = req.body.position; // 상하좌우
//   var check = req.body.check; // 눌린상태 or 뗀상태
//   if (position == '') {
//     activateLED(check);
//   } else {
//     console.log('position : ' + position + ', check : ' + check);
//     activateSERVO(position);
//   }
//   res.send({
//     check: 1
//   });
// });

// function activateLED(check) {
//   if (check == 1) {
//     // 점등
//     console.log('LED : On');
//     port.write('o');
//   } else {
//     // 소등
//     console.log('LED : Off');
//     port.write('x');
//   }
// }
//
// function activateSERVO(position) {
//   port.write(position);
// }


module.exports = router;
