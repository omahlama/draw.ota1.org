const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "static"),
    filename: "[name].[chunkhash].js"
  },
  devtool: 'source-map',
  module: {
    rules: [
      // JavaScript/JSX Files
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  // Plugins
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
};
