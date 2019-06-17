module.exports = {
  send : send
};

const config = require('../config.js');
const accountSid = config.accountSid;
const authToken = config.authToken;
const client = require('twilio')(accountSid, authToken); // twilio 모듈 로드


function send(){
  client.messages
    .create({
       body: '스마트 화재 예방 서비스 MMS 테스트',
       from: config.Twilio_NUMBER,
      // mediaUrl: config.Address + 'externalFile.jpg',
       to: config.My_NUMBER
     }, function(error, message){ //콜백 함수 설정
       if(!error){
         //console.log(message.sid);
         console.log(message.dateCreated);
       } else {
         console.log(error); //에러발생로그
       }
     }
   )
}
