'use strict';
var webpack = require('webpack');
var path = require('path');
var glob = require('glob');

//插件定义
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

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

var debug = config.debug !== undefined ? config.debug :true;

//路径定义
var srcDir  = config.src; 
var destDir = config.dest;
var nodeModPath = path.resolve(process.cwd(), './node_modules');
var publicPath = config.publicPath; //'/';
var alias = config.alias || {};
var vendor = config.vendor || [];
var port = config.port || 8080;

var plugins = [
  new webpack.BannerPlugin('作者: 空山 112093112@qq.com'),
  
  //提供预定义require
  new webpack.ProvidePlugin({
    //Base: '../../base/index.js', //从路径获取
    "$": "jquery", //从别名获取
    "jQuery": "jquery",
    "window.jQuery": "jquery",
    "Vue" :  "vue"
  }),
  
  //提取公共模块
  new CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
  })
  //HTML处理
  new HtmlWebpackPlugin({
    template: config.srcHtml_index,
    filename: 'index.html',
    showErrors: true,
    inject: 'body', //inject :true，js会注入到html任何位置
    chunks: ['vendor','base','index']
  }),
  //热加载
  ,new webpack.HotModuleReplacementPlugin()
  
  ,new webpack.optimize.OccurenceOrderPlugin()
  
];

var devtool, ifMin, extractCSS, cssLoader, sassLoader, lessLoader, cssLoaderSet,
    extractCSSOptions = {
      publicPath: '../' //用于修正css文件中的图片路径
    };

if(debug){
  
  ifMin = '';
  cssLoaderSet = 'css-loader';
  devtool = '#cheap-module-eval-source-map';
    
}else{
  
  ifMin = '.min';
  cssLoaderSet = 'css-loader?minimize';
  extractCSSOptions.allChunks = false;
  devtool = '#cheap-module-source-map';
  
  plugins.push(
    new UglifyJsPlugin({
        compress: {
            warnings: false
        },
        output: {
            comments: false
        },
        mangle: {
            except: ['$', 'exports', 'require','avalon']
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
  )
};

//css-loader用于解析，而style-loader则将解析后的样式嵌入js;  
//API : ExtractTextPlugin.extract([notExtractLoader], loader, [config])
extractCSS = new ExtractTextPlugin( 'css/[name]'+ ifMin +'-[hash:8].css');
cssLoader  = extractCSS.extract('style-loader', [cssLoaderSet, 'postcss'], extractCSSOptions);
sassLoader = extractCSS.extract('style-loader', [cssLoaderSet, 'postcss', 'sass'], extractCSSOptions);
lessLoader = extractCSS.extract('style-loader', [cssLoaderSet, 'postcss', 'less'], extractCSSOptions);
plugins.push(extractCSS);

//config
var config = {
  entry: Object.assign(
    config.entry,
    {'vendor': vendor }
  ),

  output: {
      path: destDir,
      filename: 'js/[name]' + ifMin + '-[hash:8].js',
      chunkFilename: 'js/chunk.[chunkhash:8]' + ifMin +'-[hash:8].js',//未被列在entry中，却又需要被打包出来的文件命名配置;
      publicPath: publicPath,
      sourceMapFilename: '[file]' + ifMin +'-[hash:8].map'
  },
  
  devtool : devtool,
  
  //添加了此项，则表明从外部引入，内部不会打包合并进去
  externals: {
      //jquery: 'window.jQuery',
      //...
  },
  
  //webpack-dev-server配置
  devServer: {
    contentBase: destDir,//本地服务器所加载的页面所在的目录
    colors: true,//终端中输出结果为彩色
    port : port,
    //跳转重定向 ;必须指定 contentBase 正确,否则此配置会造成错误;
    historyApiFallback: false,
    inline: true//实时刷新,cmd信息;
  },

  module: {
    loaders: [
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        loaders: [
          //小于10KB的图片会自动转成dataUrl，
          'url?limit=10000&name=img/[name]-[hash:8].[ext]',
          'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
        ]
      },
      {
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        loader: 'url?limit=10000&name=fonts/[name]-[hash:8].[ext]'
      },
      {test: /\.(tpl|ejs)$/, loader: 'ejs'},
      {test: /\.css$/, loader: cssLoader},
      {test: /\.scss$/, loader: sassLoader},
      {test: /\.less$/, loader: lessLoader},
      {test: /\.json$/, loader: "json"},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015','react']
        }
      },
      { test: /\.vue$/, loader: 'vue-loader'}
    ]
  },

  postcss: [
    require('autoprefixer')//调用autoprefixer插件
  ],
  
  //resolve 定义应用层的模块（要被打包的模块）的解析配置
  resolve: {
      extensions: ['', '.js', '.json','.es6','.jsx','css','.scss','png','jpg','jpeg','.tpl','.vue'],//可省略的文件扩展名
      root: [srcDir, nodeModPath],
      fallback : nodeModPath,
      
      //定义引用路径的别名
      alias: alias
  },
  //resolveLoader 用来配置 loader 模块的解析
  resolveLoader: { fallback: nodeModPath },
  plugins: plugins
}

return config;

}
