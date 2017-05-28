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
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

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
      filename: 'js/[name]-[hash].js',
      chunkFilename: 'js/chunk-[chunkhash].js',//未被列在entry中，却又需要被打包出来的文件命名配置;
      publicPath: config.publicPath,
      sourceMapFilename: '[file]-[hash].map'
  },
  //添加了此项，则表明从外部引入，内部不会打包合并进去
  externals: {
      //jquery: 'window.jQuery',
      //...
  },

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
              name : 'img/[name]-[contenthash].[ext]'
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
            name : 'img/[name]-[contenthash].[ext]'
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
      "Vue" :  "vue"
    }),
    //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，
    new webpack.optimize.OccurrenceOrderPlugin(),
    //css
    new ExtractTextPlugin({
     filename: 'css/[name]-[contenthash].css',
     disable: false,
     allChunks: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    //HTML处理
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: config.src.html,
      inject: true, //true : 任意位置 ,'body' : 底部
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks: ['manifest','vendor','index']
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    // 提取公共模块 split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: config.src.static,
        to: config.dest.static,
        ignore: ['.*']
      }
    ])
  ]
}
return config.debug ? merge(webpackConfBase,webpackConfDev(config)) : merge(webpackConfBase,webpackConfProd(config)) ;
}
