module.exports = {
  result: result,
  time: time,
  firedetect: firedetect
};

const cv = require('opencv4nodejs');
var moment = require('moment');
const schedule = require('node-schedule');
const fire_cascade = new cv.CascadeClassifier('./functions/firedetect.xml');
const config = require('../config.js');

var x = 1;
var opencvResult = null;
var i = 0;
var detectTime;

function result() {
  return opencvResult;
}

function time() {
  return detectTime;
}

function firedetect() {
  try {
    var vCap = new cv.VideoCapture(0);
    // var vCap = new cv.VideoCapture("http://59.15.150.53:8081/?action=stream");
    const delay = 10;
    let opencvControl = 0;
    while (x) {
      let frame = vCap.read();
      let dst = frame.resize(480, 640);

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

      if (fire_D > 1000) {
        const fd = fire_cascade.detectMultiScale(frame, 1.2, 1).objects.forEach((fireRect, i) => {
          cv.drawDetection(
            frame,
            fireRect, {
              color: new cv.Vec(255, 0, 0),
              segmenFraction: 4
            }
          );
          console.log("_Detected");
          detectTime = moment().format("YYMMDD_HHmmss");
          cv.imwrite('./pictures/' + detectTime + '.jpg', frame);
          opencvResult = 'Y';
          x = 0;
        });
      }
      cv.imshow('cascade', dst);

      const key = cv.waitKey(delay);
      if (key == 27) {
        break;
      }
    }
    vCap.release();
    cv.destroyAllWindows();

  } catch (e) {
    console.log("Couldn't start camera: ", e)
  }
}
