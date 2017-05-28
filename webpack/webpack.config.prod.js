'use strict';
var webpack = require('webpack');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

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
    //压缩css
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}}
