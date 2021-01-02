const mysql = require("mysql");

const onConnection = () => {
  let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: '3306',    
    database: "adminblog",
  });
  connection.connect();
  return connection;
};

exports.query = function (sql, parmas = null) {
  // 获取数据库链接对象
  let connection = onConnection();
  return new Promise(function (reject, resolve) {
    // 执行SQL语句
    connection.query(sql, parmas, function (error, results, fields) {
      if (error) throw error;
      reject(results);
    });
    // 关闭链接
    connection.end();
  });
};
