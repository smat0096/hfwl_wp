'use strict';
var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var gutil = require('gulp-util');
var merge = require('webpack-merge');

//插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin')

var webpackConfDev = require('./webpack.config.dev.js');
var webpackConfProd = require('./webpack.config.prod.js');
/*
//遍历入口JS文件
  var entries= function (srcDir) {
    var jsDir = path.resolve(srcDir, 'js')
    var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
    var map = {};

    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    return map;
  };

  //遍历HTML文件
  var html_plugins = function (srcDir) {
      var entryHtml = glob.sync(srcDir + '/*.html')
      var r = []
      var entriesFiles = entries(srcDir);
      console.log('入口JS文件: \n\r',entriesFiles,'\n\r\n\r模板HTML文件: \n\r',entryHtml);
      for (var i = 0; i < entryHtml.length; i++) {
          var filePath = entryHtml[i];
          var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
          var conf = {
              template: filePath,//'html!' + filePath,使用html!后 title属性无效
              filename: filename + '.html',
              title : filename
          }
          //如果和入口js文件同名
          if (filename in entriesFiles) {
              conf.inject = 'body';
              conf.chunks = ['vendor', filename];
          }
          //跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理
          //if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b')
          r.push(new HtmlWebpackPlugin(conf))
      }
      return r
  };
*/
module.exports = function(config){
//config Object.assign()
var webpackConfBase = {
  entry: config.entry,
  output: {
    path: config.dest.path,
    filename: "js/[name].[hash].js",
    chunkFilename: 'js/[name].[chunkhash].js',
    sourceMapFilename: '[file].[chunkhash].map'
  },
  //添加了此项，则表明从外部引入，内部不会打包合并进去
  externals: {
      //jquery: 'window.jQuery',
      //...
  },
  devtool : '#cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        use: [
          {
          //小于10KB的图片会自动转成dataUrl，
            loader: 'url-loader',
            options: {
              limit : 10000,
              name : 'img/[name].[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug : true,
              progressive : true,
              optipng :{
                optimizationLevel : 3,
              },
              pngquant : '{quality:"65-80",speed:4}}'
            }
          }
        ]
      },
      {
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit : 10000,
            name : 'img/[name].[hash].[ext]'
          }
        },
      },
      { 
        test: /\.(tpl|ejs)$/, 
        loader: 'ejs-loader' 
      },
      {
        test: /\.css$/, 
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader",
          publicPath: '../'
        })
      },
      {
        test: /\.scss$/, 
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "scss-loader",
          publicPath: '../'
        })
      },
      {
        test: /\.less$/, 
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "less-loader",
          publicPath: '../'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options : {
          presets: ['es2015','latest','stage-3']
        }
      }
    ]
  },
  //resolve 定义应用层的模块（要被打包的模块）的解析配置
  resolve: {
    modules: [ "node_modules" ],
    extensions: [ '.js', '.json','.es6','.jsx','css','.scss'],//可省略的文件扩展名
    //定义引用路径的别名
    alias: config.alias
  },
  
  plugins: [
    //配置超全局变量[包括业务代码]
    new webpack.DefinePlugin({
        'G.env' : config.env
    }),
    //固定注释
    new webpack.BannerPlugin('作者: 空山 112093112@qq.com'),
    //提供预定义require
    new webpack.ProvidePlugin({
      //Base: '../../base/index.js', //从路径获取
      "$": "jquery", //从别名获取
      "jQuery": "jquery",
      "Vue" :  "vue",
      "Vuex" :  "vuex",
      "VueRouter" :  "vue-router",
      //"_" :  "lodash"
    }),
    //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，
    new webpack.optimize.OccurrenceOrderPlugin(),
    //css
    new ExtractTextPlugin({
     filename: 'css/[name].[contenthash].css',
     disable: false,
     allChunks: true
    }),
    //HTML处理
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: config.src.html,
      inject: 'body', //true : 任意位置 ,'body' : 底部
      minify: {
        removeComments: !config.debug,
        collapseWhitespace: !config.debug,
        removeAttributeQuotes: !config.debug
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks: ['manifest','vendor','index']
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    // 提取公共模块
    // 注意：webpack用插件CommonsChunkPlugin进行打包的时候，将符合引用规则(minChunks)的模块打包到name参数的数组的第一个块里（chunk）,然后数组后面的块依次打包(查找entry里的key,没有找到相关的key就生成一个空的块)，最后一个块包含webpack生成的在浏览器上使用各个块的加载代码，所以页面上使用的时候最后一个块必须最先加载,
    // 如果把minChunks修改为Infinity，那么chunk1和chunk2(公有的业务逻辑部分,在main.js和main1.js中require进来)都打包到main.js,main1.js里，也就是共有逻辑不会抽取出来作为一个单独的chunk,而是打包到jquery.js中!
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','manifest'],
      minChunks: Infinity,
      // minChunks: function (module, count) { // 只抽取 node_modules 中的块
      //   return (
      //     module.resource &&
      //     /\.js$/.test(module.resource) &&
      //     module.resource.indexOf(
      //       path.join(__dirname, '../node_modules')
      //     ) === 0
      //   )
      // },
      // children: true,
      // async: true
    }),
    // 拷贝静态文件
    new CopyWebpackPlugin([
      {
        from: config.src.static,
        to: config.dest.static,
        ignore: ['.*']
      }
    ])
  ]
}

var webpackConfAdd = {};
switch(config.env){
  case 'dev' : 
    webpackConfAdd = webpackConfDev(config);
    break;
  case 'browser' : 
    break;
  case 'product' : 
    webpackConfAdd = webpackConfProd(config);
    break;
  default:
    break;
} 
return merge(webpackConfBase,webpackConfAdd);

}
