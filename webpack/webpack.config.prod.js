'use strict';
var webpack = require('webpack');
var path = require('path');
//插件
module.exports = function(config){
return {
  output: {
      publicPath: config.publicPath
  },
  devtool : '#cheap-module-source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false,
          drop_console: false
      },
      output: {
          comments: false
      },
      mangle: {
          except: ['$', 'exports', 'require', 'avalon']
        }
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
  ]
}}
