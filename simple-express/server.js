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
  //回傳的 fieldsTotal 幾乎不會用到可以省略
  let [dataTotal, fieldsTotal] = await pool.execute(
    "SELECT * FROM stock_prices WHERE stock_id=?",
    [request.params.stockId]
  );
  console.log("query stock by id:", dataTotal);

  //TODO: 取得目前在第幾頁
  // RESTful 風格之下,鼓勵把這種過濾參數用query string 來傳遞
  // /stocks/:stockId?page=1
  // 取得目前在第幾頁,而且利用 || 這個特性來做預設值
  // undefined 會是 false, 所以PAGE就被設定成 || 後面那個數字了
  let page = request.query.page || 1;
  console.log("current page", page);

  //TODO: 取得目前的總筆數
  let totalResult = dataTotal.length;
  console.log(totalResult);

  //TODO: 計算總共有幾頁
  const perPage = 10;
  let lastPage = Math.ceil(totalResult / perPage);
  console.log(lastPage);

  //TODO: 計算offset 是多少 (計算要跳過幾筆)
  let offsetCount = (page - 1) * perPage;

  //TODO: 取得這一頁的資料 SELECT * limit? offset?
  let [data] = await pool.execute(
    `SELECT * FROM stock_prices WHERE stock_id=? ORDER BY date DESC LIMIT ? OFFSET ? `,
    [request.params.stockId, perPage, offsetCount]
  );

  //test case
  //正面: 沒有page, page=1
  //負面: page=-1, page=13, page=(空白), page=a
  //TODO: 回覆給前端

  response.json({
    //用來儲存所有跟頁碼有關的資訊
    pagination: {
      lastPage,
      totalResult,
      page,
    },
    //真正的資料
    data: data,
  });

  //空資料(查不到資料)有兩種處理方式:
  //1. 200 OK 就回 []
  //2. 回覆 404
  // if (data.length === 0) {
  //   // 這裡是 404 範例
  //   response.status(404).json(data);
  // } else {
  // }
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
