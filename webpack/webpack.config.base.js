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
var _debug = config.debug;
//config Object.assign()
var webpackConfBase = {
  entry: config.entry, //入口文件
  output: {
    path: config.dest.path,              //输出路径
    filename: "js/[name].[hash].js",     //输出文件名(可含子路径)
    publicPath: config.currUrl.publicPath,//输出路径的基本路径,完整路径为: publicPath + path + filename
    chunkFilename: 'js/[name].[chunkhash].js',
    sourceMapFilename: '[file].[chunkhash].map'
  },
  //添加了此项，则表明从外部引入，内部不会打包合并进去
  externals: {
      "jquery": "$", //从别名获取
      "jquery": "jQuery",
      "vue" :  "Vue",
      "vuex" :  "Vuex",
      "vue-router" :  "VueRouter",
      "art-template" :  "template"
  },
  devtool : '#cheap-module-eval-source-map', //source-map选项
  module: { //模块
    noParse: /node_modules\/(jquey|moment|chart\.js)/, //忽略解析这些文件的依赖
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
        // 分为压缩的和非压缩的，不会重复，否则可能会报错
        // 包含css 但却不包含.min.css的
        test: /[^((?!\.min\.css).)*$]\.css$/,  //含有.min.css的文件不会压缩
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader?minimize&-autoprefixer",
          publicPath: '../'
        })
      }, 
      {
        // 包含css 包含.min.css的
        test: /\.min\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          // 不压缩css
          use: "css-loader"
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
        loader: 'babel-loader?cacheDirectory',//开启 babel-loader 缓存
        options : {
          presets: ['es2015','latest','stage-3']
        }
      }
    ]
  },
  //解析,重定向定义应用层的模块（要被打包的模块）的解析配置
  resolve: {
    modules: [ "node_modules" ],
    extensions: [ '.js', '.json','.es6','.jsx','css','.scss'],//可省略的文件扩展名
    //定义引用路径的别名
    alias: config.alias
  },
  //插件
  plugins: [
    //配置超全局变量[包括业务代码]
    new webpack.DefinePlugin({
        'G.env' : JSON.stringify(config.env), //注意,这里输出到业务环境的是标识符, 若需要识别为字符串,需双引号: "'字符串'",或 stringify;
        'G.url' : JSON.stringify(config.currUrl)
    }),
    //固定注释
    new webpack.BannerPlugin('作者: 空山 112093112@qq.com'),
    //提供预定义,无需require
    new webpack.ProvidePlugin({
      //Base: '../../base/index.js', //从路径获取
      // "$": "jquery", //从别名获取
      // "jQuery": "jquery",
      // "Vue" :  "vue",
      // "Vuex" :  "vuex",
      // "VueRouter" :  "vue-router",
      // "template" :  "art-template",
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
      title : '恒丰物流平台', //标题
      filename: 'index.html', //输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
      template: config.src.html, //模板文件路径，支持加载器，比如 html-loader!./index.html
      inject: 'body', // true | 'head' | 'body' | false  ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中
      publicPath: config.currUrl.publicPath, //向页面传递变量,替换静态资源链接
      favicon : path.resolve(process.cwd(),'./src/static/img/favicon.ico'), //favicon 路径 以 cwd 路径为基础路径;
      hash: false , // true | false, 如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用
      cache: true, // true | false，如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件
      showErrors: true, // true | false, 如果为 true, 这是默认值，错误信息会写入到 HTML 页面中
      minify: { // 传递 html-minifier 选项给 minify 输出; https://github.com/kangax/html-minifier#options-quick-reference
        removeComments: !_debug,
        collapseWhitespace: !_debug,
        removeAttributeQuotes: !_debug,
        collapseBooleanAttributes: !_debug,
        removeEmptyAttributes: !_debug,
        removeScriptTypeAttributes: !_debug,
        removeStyleLinkTypeAttributes: !_debug,
        minifyJS: !_debug,
        minifyCSS: !_debug
      },
      chunks: ['manifest','vendor','index'], //允许只添加某些块 
      // excludeChunks: [] , //允许跳过某些块
      chunksSortMode: 'dependency',  //允许控制块在添加到页面之前的排序方式，支持的值：'none' | 'default' | {function}-default:'auto'
    }),
    // 提取公共模块
    // 注意：webpack用插件CommonsChunkPlugin进行打包的时候，将符合引用规则(minChunks)的模块打包到name参数的数组的第一个块里（chunk）,然后数组后面的块依次打包(查找entry里的key,没有找到相关的key就生成一个空的块)，最后一个块包含webpack生成的在浏览器上使用各个块的加载代码，所以页面上使用的时候最后一个块必须最先加载,
    // 如果把minChunks修改为Infinity，那么共有逻辑不会抽取出来作为一个单独的chunk,而是打包到最后一个js文件中!
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','manifest'],
      // minChunks: Infinity,
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
        from: path.join(config.src.path,'static'),
        to: path.join(config.dest.path,'static')
        //ignore: ['.*']
      },
      {
        from: path.join(config.src.path,'manifest.html'),
        to: path.join(config.dest.path,'manifest.html')
      },
      {
        from: path.join(config.src.path,'manifest.appcache'),
        to: path.join(config.dest.path,'manifest.appcache')
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
