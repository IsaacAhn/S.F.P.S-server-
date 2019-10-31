module.exports = {
  send : send
};

const config = require('../config.js');
const accountSid = config.accountSid;
const authToken = config.authToken;
const client = require('twilio')(accountSid, authToken); // twilio 모듈 로드

function send(opencvTime){
  client.messages
    .create({
       body: '[스마트 화재 예방 서비스] 부평역 화재발생! 확인요망',
       from: config.Twilio_NUMBER,
      mediaUrl: 'http://58.127.197.205:3000/'+ opencvTime +'.jpg',
       to: config.IS_NUMBER
     }, function(error, message){ //콜백 함수 설정
       if(!error){
         console.log("MMS Send At "+message.dateCreated);
       } else {
         console.log(error); //에러발생로그
       }
     }
   )
}
