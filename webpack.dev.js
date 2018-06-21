const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

// Bundles (CSS) to own CSS file rather than embedded in CSS.
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: './'
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimise: true
            }
          }, 'postcss-loader']
        })
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'assets/images/[hash]-[name].[ext]'
          }
        }]
      }
    ]
  }
});