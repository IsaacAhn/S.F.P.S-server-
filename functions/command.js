var request = require("request");
const opencv = require('./firedetect');

var opencvTime;
var result;
var cvSend = 1;

opencv.firedetect();
opencvTime = opencv.time();
result = opencv.result();
request({
  uri: "http://localhost:3000/control",
  method: "POST",
  form: {
    time: opencvTime,
    send: cvSend,
    result: result
  }
}, function(err, res, body) {
  console.log(body);
});
setTimeout(function() {
  if(result == 'Y'){
    process.exit(0);
  }
}, 2000);
