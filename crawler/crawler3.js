// await version
// 1. read stock no from file (fs)
// 2. axios.get to request data

const axios = require('axios');
const fs = require("fs/promises");

(async () => {
  let stockNo = await fs.readFile("stock.txt", "utf-8");
//   console.log("read stock no from file:", stockNo);
  // https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20220301&stockNo=2330
  axios
    .get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        // 設定 query string
        response: "json",
        date: "20220301",
        stockNo: stockNo,
      },
    })
    .then((response) => {
      // response 物件
      console.log(response.data);
    })
    .catch((e) => {
      console.error(e);
    });
})();
