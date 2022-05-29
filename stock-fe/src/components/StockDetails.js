import axios from "axios";
import { useState, useEffect } from "react";

const StockDetails = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let getData = async () => {
      let response = await axios.get("http://localhost:3001/stocks/2330");
      setData(response.data.data);
    };
    getData();
  }, []);

  return (
    <div>
      {data.map((dataEach) => {
        return (
          <div key={dataEach.date} className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6" >
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
