'use strict';
var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var gutil = require('gulp-util');

//插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(config){
var _debug = config.env === 'development';
var _hash = ( config.act == 'webpack-dev-server' || config.act == 'webpack-dev-middleware' );
var webpackConfBase = {
  entry: config.entry, //入口文件
  output: {
    path: config.dest.path,              //输出路径
    filename: _hash ? `js/[name].js` : `js/[name]-[chunkhash:8].js`,     //输出文件名(可含子路径)
    publicPath: config.server.publicPath,//script标签内的 输出路径的基本路径,完整路径为: publicPath + path + filename
    chunkFilename: _hash ? `js/[name].js` : `js/[name]-[chunkhash:8].js`,
    // libraryTarget: "var", //指定你的模块输出类型，可以是commonjs,AMD,script形式,UMD模式
    // library: "myClassName" //把打包文件捆绑在 window.myClassName 实例上, 可以在入口处调用这个方法
  },
  //external的key是require时候模块名称，value是我们在页面中通过script引入的文件名!添加了此项，则表明从外部引入，内部不会打包合并进去 ,但是会增加http请求
  // 优化方案, 使用插件 DllPlugin 和 DllReferencePlugin 打包第三方全局/不处理的库
  externals: {
      "jquery": "jQuery",
      "vue" :  "Vue",
      "vuex" :  "Vuex",
      "vue-router" :  "VueRouter",
      "art-template" :  "template"
  },
  module: { //模块
    noParse: /node_modules\/(jquey|moment|chart\.js)/, //引入模块但是不会去做任何处理，也可减少构建的时间
    rules: [
      /* JS S */
        {
          test: /[^((?!\.min).)*$]\.(jsx?|vue)$/, // eslint代码检查/格式化
          loader: 'eslint-loader',
          enforce: 'pre',
          exclude: /node_modules/,
          include: config.src.babel,
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader?cacheDirectory',//开启 babel-loader 缓存
          options : {
            presets: ['es2015','env','stage-3']
          }
        },
      /* JS E */
      /* CSS S */
        {
          //  包含css 但却不包含.min.css /^(?!.*\.min).*\.css$/
          test: /\.css$/,
          use: ExtractTextPlugin.extract({ //把引入到页面内的css转换为 link 引入
            fallback: "style-loader",
            use: [
              { loader: 'css-loader', options: { importLoaders: 1 } },
              'postcss-loader'
            ],
            publicPath: '../' //校正css中 image等资源的路径
          })
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: 'css-loader',
              },
              'postcss-loader',
              'sass-loader'
            ],
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
      /* CSS E */
      /* 图片 S */
        //图片如果是在模板页面中, 可使用ejs模版语法 <img src="${ require('../img/bg.png')}" />
        {
          test: /\.(woff2?|svg|jpe?g|png|gif|ico)$/,
          use: [
            {
            //小于10KB的图片会自动转成dataUrl，
              loader: 'url-loader',
              options: {
                limit : 1000,
                name : _hash ? `img/[name].[ext]` : `img/[name]-[hash:8].[ext]`
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
        //矢量图标/字体
        {
          test: /\.(ttf|eot)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit : 10000,
              name : _hash ? `img/[name].[ext]` : `img/[name]-[hash:8].[ext]`
            }
          },
        },
      /* 图片 E */
      /* 其它 S */
        {
          test: /\.(tpl|ejs)$/,
          loader: 'ejs-loader'
        },
      /* 其它 E */
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
        'process.env.NODE_ENV' : JSON.stringify(config.env), //注意,这里输出到业务环境的是标识符, 若需要识别为字符串,需双引号: "'字符串'",或 stringify;
        'G.act' : JSON.stringify(config.act),
        'G.url' : JSON.stringify(config.url)
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
     filename: _hash ? `css/[name].css` : `css/[name]-[contenthash:8].css`,
     disable: false,
     allChunks: true
    }),
    //HTML处理
    new HtmlWebpackPlugin({ //支持 ejs 模板语法 引入到 html模板中, htmlWebpackPlugin 含 options 和 files 两个key
      title : '恒丰物流平台', //标题 可通过 <%= htmlWebpackPlugin.options.title %> 模板语法在html中调用
      filename: 'index.html', //输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
      template: config.src.html, //模板文件路径，支持加载器，比如 html-loader!./index.html
      inject: 'body', // true | 'head' | 'body' | false  ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中
      publicPath: config.server.publicPath, //向页面传递变量,替换静态资源链接
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
      // async: true,
      // chunks:['index']
    }),
    // 打包静态依赖库,生成 manifest.[name].json
    // new webpack.DllPlugin({
    //   /**
    //    * path
    //    * 定义 manifest 文件生成的位置
    //    * [name]的部分由entry的名字替换
    //    */
    //   path: path.join(__dirname, 'lib', 'manifest.[name].json'),
    //   /**
    //    * name
    //    * dll bundle 输出到那个全局变量上
    //    * 和 output.library 一样即可。
    //    */
    //   name: '[name].lib'
    // }),
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
return webpackConfBase;

}
