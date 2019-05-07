const express = require('express')
const app = express();
const config = require('./config.js');

// routes
const message = require('./routes/message');

app.use(express.static('static'));

app.use('/message', message);

app.listen(config.PORT, function(){
   console.log(`Server Running ${config.PORT} Port!`);
});

// 서버 ip 알아내기
// var os = require('os');
// function getServerIp() {
//     var ifaces = os.networkInterfaces();
//     var result = '';
//     for (var dev in ifaces) {
//         var alias = 0;
//         ifaces[dev].forEach(function(details) {
//             if (details.family == 'IPv4' && details.internal === false) {
//                 result = details.address;
//                 ++alias;
//             }
//         });
//     }
//
//     return result;
// }
// console.log(getServerIp());
