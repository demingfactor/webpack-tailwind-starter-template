// Merge Webpack Config Files for better file organisation.
const Merge = require('webpack-merge');

// Bundles (CSS) to own CSS file rather than embedded in CSS.
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Convert variable names to short names to reduce file size
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');

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
    // Clean the 'docs' folder before each build is run
    new CleanWebpackPlugin(['docs']),
    // Scan all the CSS in 'src' folder and remove unused CSS classes from the build
    new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, 'src') + '/**/*'),
      extractors: [{
        extractor: TailwindExtractor,
        // Specify the file extensions to review when scanning for CSS class names.
        extensions: ['html', 'js']
      }]
    }),
    new ExtractTextPlugin('[name].[hash:8].css'),
    // Covert variable names to short names (aka Uglify) to speed up load times with reduced file size.
    new webpack.optimize.UglifyJsPlugin(),
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