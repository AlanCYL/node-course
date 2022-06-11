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

const pool = require('./utils/db')

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

const StockRouter = require('./routers/stockRouters')
app.use('/api/stocks',StockRouter)

//HTTP request
//method:get, post, put, delete, .....
app.get("/ssr", (request, response, next) => {
  //送回response，結束了 request-response cycle
  response.render("index", {
    stocks: ["台積電", "長榮", "聯發科"],
  });
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
