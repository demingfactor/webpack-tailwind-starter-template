const webpack = require('webpack')

// Autogenerates index.js into a index.html with auto script tags
const HtmlWebpackPlugin = require('html-webpack-plugin') //

// Purges unused CSS (Great for use with a style framework like Tailwind)
const PurgecssPlugin = require('purgecss-webpack-plugin')

// Wipes docs directory on recompiling, keeping the directory clean.
const CleanWebpackPlugin = require('clean-webpack-plugin')

// Bundles (CSS) to own CSS file rather than embedded in CSS.
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const UrlLoader = require("url-loader");
const FileLoader = require("file-loader");

const CopyWebpackPlugin = require('copy-webpack-plugin');

const tailwindcss = require('tailwindcss')
const glob = require('glob')
const path = require('path')

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || []
  }
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: ['./src/index.js'],
  module: {
    rules: [{
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'assets/images/[hash]-[name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new CopyWebpackPlugin([{
      context: 'src/assets/stylesheets/',
      from: '*.css',
      to: path.resolve(__dirname, 'docs/assets/stylesheets/')
    }, {
      context: 'src/assets/images/',
      from: '*.png',
      to: path.resolve(__dirname, 'docs/assets/images/')
    }, {
      context: 'src/assets/stylesheets',
      from: '*.svg',
      to: path.resolve(__dirname, 'docs/assets/stylesheets')
    }, {
      context: 'src/assets/stylesheets',
      from: '*.svg',
      to: path.resolve(__dirname, 'docs/assets/stylesheets')
    }]),
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
      minify: isProd && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
  ].filter(Boolean)
}