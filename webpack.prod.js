// Merge Webpack Config Files for better file organisation.
const Merge = require('webpack-merge');

// Bundles (CSS) to own CSS file rather than embedded in CSS.
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Convert variable names to short names to reduce file size
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = Merge(common, {
  devtool: 'source-map',
  plugins: [
    // new ExtractTextPlugin('[name].[contenthash:8].css'),
    // new ExtractTextPlugin("[name].css"),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
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
    }]
  }
});