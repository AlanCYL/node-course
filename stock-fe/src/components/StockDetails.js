import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../utilis/config";


const StockDetails = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { stockId } = useParams();
  useEffect(() => {
    let getData = async () => {
      let response = await axios.get(`${API_URL}/stocks/${stockId}`, {
        params: {
          page: page,
        },
      });
      setData(response.data.data);
      //在react裡不能直接去設定state變數
      //這樣react不知道狀態被改變
      //lastPage = response.data.pagination.lastPage;
      //一定要透過setXXXX去設定狀態
      setLastPage(response.data.pagination.lastPage);
      // console.log(response.data.pagination.lastPage);
    };
    getData();
  }, [page]);
  //初始化的時候，page會從沒有定義變成預設值 -> 引發副作用
  //點擊頁碼，會透過onclick改變page的值 -> 引發副作用

  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
      //page 是我們現在在第幾頁
      pages.push(
        <li
          style={{
            display: "inline-block",
            margin: "2px",
            backgroundColor: page === i ? "#00d1b2" : "",
            borderColor: page === i ? "#00d1b2" : "#dbdbdb",
            color: page === i ? "#fff" : "#363636",
            borderWidth: "1px",
            width: "28px",
            height: "28px",
            borderRadius: "3px",
            textAlign: "center",
          }}
          key={i}
          onClick={() => {
            setPage(i);
          }}
        >
          {i}
        </li>
      );
    }
    return pages;
  };

  return (
    <div>
      <ul>{getPages()}</ul>
      {data.map((dataEach) => {
        return (
          <div
            key={dataEach.date}
            className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              日期：{dataEach.date}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交金額：{dataEach.amount}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交股數：{dataEach.volume}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              開盤價：{dataEach.open_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              收盤價：{dataEach.close_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              漲跌價差：{dataEach.delta_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最高價：{dataEach.high_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最低價：{dataEach.low_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交筆數：{dataEach.transactions}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default StockDetails;
