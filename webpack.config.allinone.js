'use strict';
var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var gutil = require('gulp-util');

//插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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

//路径定义
var publicPath = config.path.publicPath; //'/';
var devtool, min, allChunks ,plugins = [];
if(config.env !== 'product'){
  min = '';
  allChunks = false;
  devtool = '#cheap-module-eval-source-map';
}else{
  min = '.min';
  allChunks = true;
  devtool = '#cheap-module-source-map';
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: false
        },
        output: {
            comments: false
        },
        mangle: {
            except: ['$', 'exports', 'require','avalon']
        }
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
  )
};


//config Object.assign()
return {
  entry: config.entry,
  output: {
      path: config.path.dest,
      filename: 'js/[name]' + min + '-[hash:8].js',
      chunkFilename: 'js/chunk.[chunkhash:8]' + min +'-[hash:8].js',//未被列在entry中，却又需要被打包出来的文件命名配置;
      publicPath: config.path.publicPath,
      sourceMapFilename: '[file]' + min +'-[hash:8].map'
  },
  
  devtool : devtool,
  
  //添加了此项，则表明从外部引入，内部不会打包合并进去
  externals: {
      //jquery: 'window.jQuery',
      //...
  },
  
  //webpack-dev-server配置
  devServer: {
    contentBase: config.path.dest,//本地服务器所加载的页面所在的目录
    port : config.port,
    //跳转重定向 ;必须指定 contentBase 正确,否则此配置会造成错误;
    historyApiFallback: true,
    inline : true,//启动inline
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true // only errors & warns on hot reload
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
              name : 'img/[name]-[hash:8].[ext]'
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
            name : 'img/[name]-[hash:8].[ext]'
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
    alias: {
      jquery : path.join(config.path.src , './js/lib/jquery-2.1.4.js'),
      vue : path.join(config.path.src , './js/lib/vue-2.1.6.js'),
    }
  },
  
  plugins: [
    new webpack.BannerPlugin('作者: 空山 112093112@qq.com'),
    //提供预定义require
    new webpack.ProvidePlugin({
      //Base: '../../base/index.js', //从路径获取
      "$": "jquery", //从别名获取
      "jQuery": "jquery",
      "Vue" :  "vue"
    }),

    //提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    //HTML处理
    new HtmlWebpackPlugin({
      template: config.path.html,
      filename: 'index.html',
      showErrors: true,
      inject: 'body', //inject :true，js会注入到html任何位置
      chunks: ['manifest','vendor','index']
    }),
    //配置超全局变量[包括业务代码]
    new webpack.DefinePlugin({
        env : config.env
    }),
    //热加载
    new webpack.HotModuleReplacementPlugin(),
    //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，
    new webpack.optimize.OccurrenceOrderPlugin(),
    //css
    new ExtractTextPlugin({
     filename: 'css/[name]'+ min +'-[hash:8].css',
     disable: false,
     allChunks: allChunks
    })
  ].concat(plugins)
}
}
