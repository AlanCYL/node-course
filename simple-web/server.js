const http = require("http");

const server = http.createServer((request, response) => {
  // 當你的server接收到request的時候要做什麼事
  response.statusCode(200);
  response.end("hello server");
});

server.listen(3001, () => {
  console.log("Server running at port 3001");
});
