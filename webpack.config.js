var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
var path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/scripts/main.js",
  },//path relative to this file
  output: {
    path: path.join(__dirname, "../dist/"),
    filename: "[name].bundle.js",
  },
  watch: true,
  resolve: { extensions: [".js", ".ts"] },
  devServer: {
    contentBase: path.join(__dirname, "../dist/"),
    port: 9000
  },
	plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/styles', to: './styles' },
        { from: './node_modules/bootstrap/dist/css/bootstrap.min.css', to: './styles/bootstrap/css' },
        { from: './node_modules/bootstrap-icons/font/bootstrap-icons.css', to: './styles/bootstrap-icons/font' },
        { from: './node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff', to: './styles/bootstrap-icons/font/fonts' },
        { from: './node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2', to: './styles/bootstrap-icons/font/fonts' }
      ],
    }),
    new HtmlWebpackPlugin({
        hash: true,
        /* title: 'My Awesome application from params', */
        /* myPageHeader: 'Hello World from param', */
        template: './src/index.html',
        filename: 'index.html'
    })
  ]
}
