module.exports = {
  firedetection: detect
}

const cv = require('opencv4nodejs');
const schedule = require('node-schedule');
const fire_cascade = new cv.CascadeClassifier('./functions/firedetect.xml');
const SerialPort = require('serialport');
const config = require('../config.js');
const port = new SerialPort(config.serialPort2, {
  baudRate: 9600
});
var Readline = SerialPort.parsers.Readline
var parser = new Readline()
port.pipe(parser)
var x = 1;
var i = 0;

function detect() {
  try {
    var vCap = new cv.VideoCapture(0);
    //var vCap = new cv.VideoCapture("http://59.15.152.84:8081/?action=stream");
    const delay = 10;

    let r = 0;
    //const fourcc = cv.VideoWriter.fourcc('JPEG');
    //const out = new cv.VideoWriter('./pictures/test.jpg', fourcc, 0, new cv.Size(640,480), true);
    while (x) {
      let frame = vCap.read();
      let dst = frame.resize(480, 640)

      if (frame.empty) {
        vCap.reset();
        frame = vCap.read();
      }

      const blur = frame.medianBlur(3);
      const matHSV = blur.cvtColor(cv.COLOR_BGR2HSV);
      lower = new cv.Vec(18, 80, 50);
      upper = new cv.Vec(35, 255, 255);
      const mask = matHSV.inRange(lower, upper);

      var fire_D = mask.countNonZero();

      // if(fire_D > 1000){
      // 	console.log("primary detected");
      // }
      const fd = fire_cascade.detectMultiScale(frame, 1.2, 1).objects.forEach((fireRect, i) => {
        cv.drawDetection(
          frame,
          fireRect, {
            color: new cv.Vec(255, 0, 0),
            segmenFraction: 4
          }
        );
        if (r == 0) {
          console.log("_Detected");
          cv.imwrite('./pictures/test.jpg', frame);
          port.write("1");
          r = 1;
        }
      });
      if(r == 1){
        r = 2;
        x = 0;
      }

      //cv.imshow('color', mask);
      cv.imshow('cascade', dst);

      const key = cv.waitKey(delay);
      if (key == 27) break;
    }
    vCap.release();
    cv.destroyAllWindows();

  } catch (e) {
    console.log("Couldn't start camera: ", e)
  }
}
