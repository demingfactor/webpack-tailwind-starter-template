const webpack = require('webpack')

//////////////////////////////////////////////////////////////////////
// 1. ADD LOADERS TO HELP WEBPACK UNDERSTAND THINGS.
// By defauly Webpack nativley only understands JS.
// Use Loaders to help webpack understand more filetypes.
//////////////////////////////////////////////////////////////////////

  // Enable Webpack to read common non-JS files
  const FileLoader = require("file-loader");

  // Enable Webpack to read common non-JS files and make small file into embedded data
  const UrlLoader = require("url-loader");

//////////////////////////////////////////////////////////////////////
// 2A. ADD PLUGINS THAT DO CONVERSIONS BETWEEN THINGS
//////////////////////////////////////////////////////////////////////

  // Autogenerates index.js into a index.html with auto script tags
  const HtmlWebpackPlugin = require('html-webpack-plugin')

  // Bundles (CSS) to own CSS file rather than embedded in CSS.
  const ExtractTextPlugin = require("extract-text-webpack-plugin");

  const CopyWebpackPlugin = require('copy-webpack-plugin');

//////////////////////////////////////////////////////////////////////
// 2B. ADD PLUGINS THAT TIDY UP THINGS
//////////////////////////////////////////////////////////////////////

  // Purges unused CSS (Great for use with a style framework like Tailwind)
  const PurgecssPlugin = require('purgecss-webpack-plugin')

  // Wipes docs directory on recompiling, keeping the directory clean.
  const CleanWebpackPlugin = require('clean-webpack-plugin')

//----------------------------------------------------------------------//

//////////////////////////////////////////////////////////////////////
// 3. Set some constants
//////////////////////////////////////////////////////////////////////

const tailwindcss = require('tailwindcss');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production'

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || []
  }
}

//---------------------  Real code starts here  ------------------------//

module.exports = {
  entry: ['./src/index.js'],
  module: {
    rules: [{
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader', // url-loader defaults back to loading with file-loader if size over size limit.
          options: {
            limit: 8000, // Convert files < 8kb to base64 strings
            name: 'assets/images/[hash]-[name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'url-loader', // url-loader defaults back to loading with file-loader if size over size limit.
          options: {
            limit: 8000, // Convert files < 8kb to base64 strings
            name: 'assets/fonts/[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    // Clean the 'docs' folder before each build is run
    isProd && new CleanWebpackPlugin(['docs']),
    isProd && new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, 'src') + '/**/*'),
      extractors: [{
        extractor: TailwindExtractor,
        // File extensions to include when scanning for class names.
        extensions: ['html', 'js']
      }]
    }),
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
      context: 'src/assets/stylesheets/fonts',
      from: '*/*',
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      to: path.resolve(__dirname, 'docs/assets/stylesheets/fonts')
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