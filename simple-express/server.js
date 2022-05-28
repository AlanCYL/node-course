// npm i express
// 導入 express 這個模組
const express = require("express");

// 利用 express 來建立一個 express application
const app = express();
const cors = require("cors");
app.use(cors());
// const path = require("path");

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
  })
  .promise();

//express 是一個由 middleware (中間件) 組成的世界

// client - server
// client send request ----------> server
//                     <---------- response
//request-response cycle
//client: browser, postman, nodejs

// express 是一個由 middleware (中間件) 組成的世界

// 一般中間件
// app.use((request, response, next) => {
//   console.log("很棒喔這是一般中間件");
//   next();
// });

//HTTP request
//method:get, post, put, delete, .....
app.get("/ssr", (request, response, next) => {
  //送回response，結束了 request-response cycle
  response.render("index", {
    stocks: ["台積電", "長榮", "聯發科"],
  });
});

app.get("/stocks", async (request, response, next) => {
  let [data, fields] = await pool.execute("SELECT * FROM stocks");
  response.json(data);
});

app.get("/stocks/:stockId", async (request, response, next) => {
  let [data, fields] = await pool.execute(
    "SELECT * FROM stocks WHERE id=" + request.params.stockId
  );

  console.log("query stock by id:", data);
  //空資料(查不到資料)有兩種處理方式:
  //1. 200 OK 就回 []
  //2. 回覆 404
  if (data.length === 0) {
    // 這裡是 404 範例
    response.status(404).json(data);
  } else {
    response.json(data);
  }
});

//這個中間件在所有的路由後面
//會到這裡表示前面所有的路由中間件都沒有比到符合的網址
// =>404
app.get("/error", (req, res, next) => {
  throw new Error("故意製造的錯誤");
  res.send("error");
});
app.use((req, res, next) => {
  console.log("所有路由的後面 ==> 404");
  res.status(404).send("not found");
});

app.listen(3001, () => {
  console.log("Server start at 3001");
});
