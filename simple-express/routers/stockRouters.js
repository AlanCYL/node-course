const express = require("express");
const router = express.Router();
// router is a mini-app

const pool = require('../utils/db');

router.get("/", async (request, response, next) => {
    let [data, fields] = await pool.execute("SELECT * FROM stocks");
    response.json(data);
  });
  
  router.get("/:stockId", async (request, response, next) => {
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
    // console.log("current page", page);
  
    //TODO: 取得目前的總筆數
    let totalResult = dataTotal.length;
    // console.log(totalResult);
  
    //TODO: 計算總共有幾頁
    const perPage = 10;
    let lastPage = Math.ceil(totalResult / perPage);
    // console.log(lastPage);
  
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

  module.exports = router;