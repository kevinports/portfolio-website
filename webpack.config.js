const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './index.js', './styles/index.scss'
  ],
  output: {
    path: path.join(__dirname, '/www/assets'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ],
      },
      {
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader','postcss-loader'],
        })
      }
    ],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': '"production"'
    // }),
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'bundle.css',
      allChunks: true,
      disable: process.env.NODE_ENV !== 'production'
    }),
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "www"),
    compress: true,
    port: 3001,
    inline: true,
    historyApiFallback: true
  }
};
