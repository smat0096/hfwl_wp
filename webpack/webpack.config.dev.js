'use strict';
var webpack = require('webpack');
module.exports = function(config){
return {
  devServer: {
    contentBase: config.dest.path,//本地服务器所加载的页面所在的目录
    watchContentBase: true,
    port : config.browser.port,
    //跳转重定向 ;必须指定 contentBase 正确,否则此配置会造成错误;
    historyApiFallback: true,
    inline : true,//启动inline模式,inline模式一般用于单页面应用开发，会自动将socket注入到页面代码中
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true // only errors & warns on hot reload
  },
  plugins: [
    //热加载
    new webpack.HotModuleReplacementPlugin()
  ]
}}
