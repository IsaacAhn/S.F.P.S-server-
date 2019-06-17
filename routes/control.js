
  const express = require('express');
  const router = express.Router(); //라우터 레벨 미들웨어
  const SerialPort = require('serialport')
  const config = require('../config.js'); // config 파일 불러오기
  const fcm = require('./fcm');
  const mms = require('./mms');

  const port = new SerialPort(config.serialPort, {
    baudRate: 9600
  });

  var Readline = SerialPort.parsers.Readline
  var parser = new Readline()
  port.pipe(parser)


  port.on('open', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('Port is opend . . .');
  });

  port.on('error', function(err) {
    console.log('Error: ', err.message);
  });

  parser.on('data', function (data) {
    var str = JSON.stringify(data); // JSON객체를 String 객체로 변환
     str = JSON.parse(data); //String 객체를 JSON객체로 변환

  if (str.Flame >50) {
    port.write("A");
    console.log("Fire flame sense.. flame value : ", str.Flame);
    fcm.send();
    mms.send();
  }
  else if (str.Temperature > 38 ) {
    port.write("B");
    console.log("abnormal temp sense.. temp value : ", str.Temperature);
  }
  else if (str.Smoke > 500) {
    port.write("C");
    console.log("abnormal smoke and gas sense.. smoke and gas value : ", str.Smoke);
  }
  else if (str.Flame > 50 && str.Temperature > 38 || str.Temperature>38 && str.Smoke>500 || str.Flame>50 && str.Smoke>500 ) {
    port.write("D");
    console.log("absoultly fire !! ");
  }
  else {
    port.write("E");
    console.log("Flame : " , str.Flame);
    console.log("Temperature : ", str.Temperature);
    console.log("Smoke : ", str.Smoke);
    console.log('\n');
    }
  });


  router.post('/', function(req, res){
    var position = req.body.position; // 상하좌우
    var check = req.body.check; // 눌린상태 or 뗀상태
    if(position==''){
      activateLED(check);
    } else {
      console.log('position : '+position+', check : '+check);
      activateSERVO(position);
    }
    res.send({check : 1});
  });

  function activateLED(check) {
    if(check == 1){
      // 점등
      console.log('LED : On');
      port.write('o');
    } else {
      // 소등
      console.log('LED : Off');
      port.write('x');
    }
  }

  function activateSERVO(position){
    port.write(position);
  }


  module.exports = router;
