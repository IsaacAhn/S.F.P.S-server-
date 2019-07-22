module.exports = {
  insertData : insertData,
  selectData : selectData
};



/*
sensorData 테이블
+-------------+-------------+------+-----+---------+-------+
| Field       | Type        | Null | Key | Default | Extra |
+-------------+-------------+------+-----+---------+-------+
| id          | varchar(20) | NO   | PRI | NULL    |       |
| flame       | int(11)     | NO   |     | NULL    |       |
| temperature | int(11)     | NO   |     | NULL    |       |
| smoke       | int(11)     | NO   |     | NULL    |       |
| location    | varchar(50) | NO   |     | NULL    |       |
| Xpos        | varchar(10) | YES  |     | NULL    |       |
| Ypos        | varchar(10) | YES  |     | NULL    |       |
+-------------+-------------+------+-----+---------+-------+
*/

const config = require('../config.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.MYSQL_CONFIG);


function insertData(sensorData){
  var sql = 'insert into sensorData values (?, ?, ?, ?, ?, ?, ?)'
  pool.getConnection(function(err, connection){
    if(err){
      console.log(err);
      connection.release();
      return;
    }
    connection.query(sql, [sensorData.id, sensorData.flame, sensorData.temperature,
      sensorData.smoke, sensorData.location, sensorData.Xpos, sensorData.Ypos], function(err, rows, fields){
      if(err){
        console.log(err);
        connection.release();
        return;
      }
      connection.release();
      console.log('insertData Complete!');
      });
  });
}

function selectData(){
  var sql = 'select * from sensorData'
  pool.getConnection(function(err, connection){
    if(err){
      console.log(err);
      connection.release();
      return;
    }
    connection.query(sql, function(err, rows, fields){
      if(err){
        console.log(err);
        connection.release();
        return;
      }
      connection.release();
      console.log('DATA : '+JSON.stringify(rows));
      });
  });
}
