const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./public/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "static/js/[name].[contenthash:8].chunk.js",
  },
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
      },
    },
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx"],
  },
  experiments: {},
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules\/(?!antd\/).*/,
          name: "vendors",
          chunks: "all",
        },
        antd: {
          test: /node_modules\/(antd\/).*/,
          name: "antd",
          chunks: "all",
        },
      },
    },
    runtimeChunk: {
      name: "manifest",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css|scss|saas)/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(svg)/,
        type: "asset",
        use: ["svgo-loader"],
      },
      {
        test: /\.(pdf|png)/,
        type: "asset/resource",
        use: ["svgo-loader"],
      },
    ],
  },
};
