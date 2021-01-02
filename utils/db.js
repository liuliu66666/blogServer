const config = require("../config");
const dbConfig = config.database;
const mysql = require("mysql");

const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
  database: dbConfig.DATABASE,
  charset: "utf8mb4",
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        resolve(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

const createTable = (sql) => {
  return query(sql, []);
};

const selectAll = (table) => {
  const _sql = "select * from ??";
  return query(_sql, [table]);
};

const selectAllById = (table, id) => {
  const _sql = "select * from ?? where id = ?";
  return query(_sql, [table, id]);
};

const selectKeys = (table, keys) => {
  const _sql = "select ?? from ??";
  return query(_sql, [keys, table]);
};

module.exports = {
  query,
  createTable,
  selectAll,
  selectAllById,
  selectKeys,
};
