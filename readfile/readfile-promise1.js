const fs = require("fs");

let p = new Promise((resolve, reject) => {
  fs.readFile("test.txt", "utf-8", (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

p.then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(`喔喔喔，發生錯誤了`);
  console.error(error);
});
