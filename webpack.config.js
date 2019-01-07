const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "static"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      // JavaScript/JSX Files
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  }
};
