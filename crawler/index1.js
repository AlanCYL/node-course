const axios = require('axios').default;

axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
    params:{
        //設定 query string
        response:"json",
        date:"20220515",
        stockNo:"2330",
    }
})
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });