var config = require('../../config/environment');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : config.db.host,
  port     : config.db.port,
  user     : config.db.user,
  password : config.db.password,
  database : config.db.database
});
 
connection.connect((err, result) => {
  if (err) {
    console.log(err);
    console.log("连接失败");
    return;
  }
  console.log(result);
  console.log("连接成功");
});

module.exports = connection;

