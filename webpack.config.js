const path = require("path");
console.log(__dirname);
console.log(path);

module.exports = {
  entry: "./src/client/js/main.js",
  output: {
    filename: "main.js",
    path: "./assets/js",
  },
};
