[1mdiff --git a/crawler/crawler4.js b/crawler/crawler4.js[m
[1mindex c411054..6706231 100644[m
[1m--- a/crawler/crawler4.js[m
[1m+++ b/crawler/crawler4.js[m
[36m@@ -1,14 +1,18 @@[m
[31m-//read stock no from mysql database[m
[32m+[m[32m// read stock no from mysql database[m
 [m
[31m-//mysql2 是一個第三方套件[m
[31m-//npm i mysql2[m
[31m-//引用進來[m
[32m+[m[32mconst axios = require('axios');[m
 [m
[31m-const mysql = require("mysql2/promise");[m
[32m+[m[32m// mysql2 是一個第三方套件[m
[32m+[m[32m// npm i mysql2[m
[32m+[m[32m// 引用進來[m
[32m+[m[32mconst mysql = require('mysql2/promise');[m
 // const dotenv = require('dotenv');[m
[31m-require("dotenv").config();[m
[32m+[m[32m// dotenv.config();[m
[32m+[m[32m// 幫我們去把 .env 裡的變數讀進來[m
[32m+[m[32mrequire('dotenv').config();[m
 [m
 (async () => {[m
[32m+[m[32m  console.log('DB_HOST', process.env.DB_host);[m
   const connection = await mysql.createConnection({[m
     host: process.env.DB_host,[m
     port: process.env.DB_port,[m
[36m@@ -16,9 +20,49 @@[m [mrequire("dotenv").config();[m
     password: process.env.DB_password,[m
     database: process.env.DB_database,[m
   });[m
[31m-  let [data, fields] = await connection.execute("SELECT * FROM stocks");[m
 [m
[31m-  console.log(data);[m
[32m+[m[32m  let [data, fields] = await connection.execute('SELECT * FROM stocks');[m
[32m+[m[32m  // console.log(data);[m
[32m+[m[32m  // results [[m
[32m+[m[32m  //     [],[m
[32m+[m[32m  //     [][m
[32m+[m[32m  // ][m
[32m+[m[32m  //let data = results[0];[m
[32m+[m[32m  //let fields = results[1];[m
[32m+[m
[32m+[m[32m  /********** for 迴圈版本  ********************/[m
[32m+[m[32m  // for (let i = 0; i < data.length; i++) {[m
[32m+[m[32m  //   let response = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {[m
[32m+[m[32m  //     params: {[m
[32m+[m[32m  //       response: 'json',[m
[32m+[m[32m  //       date: '20220301',[m
[32m+[m[32m  //       stockNo: data[i].id,[m
[32m+[m[32m  //     },[m
[32m+[m[32m  //   });[m
[32m+[m[32m  //   console.log(response.data);[m
[32m+[m[32m  // }[m
[32m+[m[32m  /****************************************** */[m
[32m+[m
[32m+[m[32m  /************* map 版本 ************************** */[m
[32m+[m[32m  let mapResult = data.map(async (stock) => {[m
[32m+[m[32m    let response = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {[m
[32m+[m[32m      params: {[m
[32m+[m[32m        // 設定 query string[m
[32m+[m[32m        response: 'json',[m
[32m+[m[32m        date: '20220301',[m
[32m+[m[32m        stockNo: stock.id,[m
[32m+[m[32m      },[m
[32m+[m[32m    });[m
[32m+[m[32m    return response.data;[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  // mapResult[m
[32m+[m[32m  // [ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ][m
[32m+[m
[32m+[m[32m//   console.log(mapResult);[m
[32m+[m[32m  let priceResults = await Promise.all(mapResult);[m
[32m+[m[32m  console.log(priceResults);[m
[32m+[m[32m  /****************************************** */[m
 [m
   connection.end();[m
 })();[m
