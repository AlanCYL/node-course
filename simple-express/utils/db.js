const mysql = require("mysql2");
require("dotenv").config();

let pool = mysql
  .createPool({
    host: process.env.DB_host,
    port: process.env.DB_port,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    // 為了 pool 新增的參數
    connectionLimit: 10,
    dateStrings: true,
  })
  .promise();

module.exports = pool;
