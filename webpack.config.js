const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Dotenv = require('dotenv-webpack');

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
    new TerserPlugin(),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'bundle.css',
      allChunks: true,
      disable: process.env.NODE_ENV !== 'production'
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }),
    new Dotenv({
      path: './.env'
    })
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, "www"),
    index: 'dev.html',
    compress: true,
    port: 3001,
    inline: true,
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/dev.html' }
      ]
    }

  }
};
