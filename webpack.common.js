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
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: './'
  },
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
    // Clean the 'docs' folder in production
    isProd && new CleanWebpackPlugin(['docs']),
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    // Scan all the files in the 'src' folder and remove
    // unused class names in production
    isProd && new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, 'src') + '/**/*'),
      extractors: [{
        extractor: TailwindExtractor,
        // Specify the file extensions to include when scanning for
        // class names.
        extensions: ['html', 'js']
      }]
    }),
    new CopyWebpackPlugin([{
      context: 'src/assets/stylesheets/',
      from: '*.css',
      to: path.resolve(__dirname, 'docs/assets/stylesheets/')
    }, {
      context: 'src/assets/images/',
      from: '*.png',
      to: path.resolve(__dirname, 'docs/assets/images/')
    }, {
      context: 'src/assets/stylesheets/icons',
      from: '*.svg',
      to: path.resolve(__dirname, 'docs/assets/stylesheets/icons/')
    }, {
      context: 'src/assets/stylesheets/header_background',
      from: '*.svg',
      to: path.resolve(__dirname, 'docs/assets/stylesheets/header_background/')
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
    isProd && new webpack.optimize.UglifyJsPlugin()
  ].filter(Boolean)
}