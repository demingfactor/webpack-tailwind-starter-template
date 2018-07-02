// Merge Webpack Config Files for better file organisation.
const Merge = require('webpack-merge');

// Bundles (CSS) to own CSS file rather than embedded in CSS.
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Purges unused CSS (Great for use with a style framework like Tailwind)
const PurgecssPlugin = require('purgecss-webpack-plugin');

// Wipes docs directory on recompiling, keeping the directory clean.
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Convert variable names to short names to reduce file size
// Uglyifying is now on by default for the production mode.

const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || []
  }
}

module.exports = Merge(common, {
  mode: "production",
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: './'
  },
  plugins: [
    new ExtractTextPlugin('[name].[hash:8].css'),
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