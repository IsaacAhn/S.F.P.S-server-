const express = require('express');
const router = express.Router();
const SerialPort = require('serialport')
const port = new SerialPort('COM4', {
  baudRate: 9600
});

port.on('open', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message);
  }
  console.log('Port is opend . . .');
});
port.on('error', function(err) {
  console.log('Error: ', err.message);
})
port.on('data', function (data) {
  console.log('Received : ' + data);
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

module.exports = router;




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
