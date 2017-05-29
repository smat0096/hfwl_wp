var webpack = require('webpack');
var path = require('path');
var glob = require('glob')
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成最终的Html5文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

//自定义"魔力"变量
var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
    __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

var srcDir = path.join(__dirname, './example/src'); //process.cwd() 取当前工作目录
var distDir = path.join(__dirname, './example/dist');
var nodeModPath = path.resolve(__dirname, './node_modules');

//entries函数
var entries= function () {
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
var html_plugins = function () {
    var entryHtml = glob.sync(srcDir + '/*.html')
    var r = []
    var entriesFiles = entries();
    console.log('入口JS文件: \n\r',entriesFiles,'\n\r模板HTML文件: \n\r',entryHtml);
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


var plugins = [
  //注释插件
  new webpack.BannerPlugin('作者: 空山 112093112@qq.com'), 
  
  //抽取文件中的公用模块,注意被抽取后的文件,必须和公共文件整体引入,否则会文件缺失报错
  //注意 使用此配置有可能导致加载顺序变更
  //注意 vendor.js引入如果放到后面，会导致page.js执行异常，所以，请一定把vendor.js 放在前面。
  new CommonsChunkPlugin({

    //给这个包含公共代码的chunk的命名（唯一标识）
    name: "common", 
    
    //命名打包后生产的js文件,如果需要控制目录结构的，直接在filename参数里动手脚即可
    filename: 'js/[name]-[hash].js', 

    //表示需要在哪些chunk（也可以理解为webpack配置中entry的每一项）里寻找公共代码进行打包
    chunks: ['entry-c','entry-d'],
    
    //minChunks，公共代码的判断标准
    minChunks: Infinity //3-5
  }),

/*
  //new ExtractTextPlugin([id: string], filename: string, [options])
  //将从每一个用到了require("style.css")的entry chunks文件中抽离出css到单独的output文件
  //变量参数:[name]-[hash]-[chunkhash]-[contenthash]-

  new ExtractTextPlugin("css/[name]-[hash].css", {
      disable: false,
      allChunks: true
  }),
*/

  //抽取HTML,注意此插件会受file-loader的影响,可多个
  new HtmlWebpackPlugin({
      title:'webpack-01-index',
      template: path.join(__dirname,"./example/src/index.html"),
      filename: 'index.html',
      showErrors: true,
      inject: 'body', //inject :true，js会注入到html任何位置

      //或excludeChunks, 依次为: 第三方库打包, 单独入口a, 入口c和d所抽取的公共部分,入口c,入口d
      chunks: ['vendor','entry-a','common','entry-c','entry-d']
    })
  ,
  new HtmlWebpackPlugin({
    title:'webpack-01-subPage',
    template: path.join(__dirname,"./example/src/entry-b.html"),
    filename: 'sub.html',
    showErrors: true,
    chunks: ['entry-b'] //或excludeChunks, 注意前面使用entries函数遍历的话,这里的chunk名就变了;
  }),

  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin(),

  //定义全局变量
  definePlugin,

  //设置此处，则在JS中不用类似require('./base')引入基础模块， 只要直接使用Base变量即可
  //此处通常可用做，对常用组件，库的提前设置
  new webpack.ProvidePlugin({
      Moment: 'moment', //直接从node_modules中获取
      Base: '../../base/index.js', //从文件中获取
      "$": "jquery", //从别名获取
      "jQuery": "jquery",
      "window.jQuery": "jquery",
      "Vue" :  "vue"
  })
  
  ,new webpack.HotModuleReplacementPlugin()
];

//css-loader用于解析，而style-loader则将解析后的样式嵌入js;
//这里我们使用插件提取到css文件, 因此不需使用 style-loader
//API : ExtractTextPlugin.extract([notExtractLoader], loader, [options])
var extractCSS = new ExtractTextPlugin('css/[name].css?[hash:8]')
var cssLoader = extractCSS.extract(
  'style-loader', 
  'css-loader',//?modules!postcss',
  {
    publicPath: '../' //指定引用路径,用于修正抽取css文件中的图片路径
    //在服务器模式下, 并设置了全局 publicPath 使用绝对路径的情况可以不用此属性修正;
  }
)
var sassLoader = extractCSS.extract(
  'style-loader', 
  'css-loader!sass-loader',
  {
    publicPath: '../' 
  }
)

plugins.push(extractCSS);
//plugins = plugins.concat(html_plugins());

module.exports = {
  //上下文
  context: srcDir,

  //devtool: '#source-map',//配置devtool选项 
  
//webpack-dev-server配置
  devServer: {
    contentBase: distDir,//本地服务器所加载的页面所在的目录
    colors: true,//终端中输出结果为彩色

    //依赖于H5 history API，设置为true则所有的跳转将指向index.html ;
    //必须指定 contentBase 正确,否则此配置会造成错误;
    historyApiFallback: true,
    
    port : 8080,
    inline: true // 对应ifram模式, 显示路径
  },

  //入口配置,每个入口称为一个chunk
  /*
  entry: {
    'index-a' : path.join( srcDir,'js','./entry-a.js'),
    'index-b': path.join( srcDir,'js','./entry-b.js'),
    'vendor' : [ //数组格式,会依照顺序加载
        path.join( srcDir ,'js','./entry-c.js'),
        path.join( srcDir,'js','./entry-d.js'),
    ]
  },
  */
  entry: Object.assign(
    entries()//使用entries函数自动遍历入口js文件
    ,{
      // 用到什么公共lib（例如jquery.js），就把它加进vendor去，目的是将公用库单独提取打包
      'vendor': ['jquery', 'loadash']
    }
  ),

  //输出配置
  output: {
    path: distDir, //输出路径,需传入绝对路径
    filename: "js/[name].js?[hash:8]",//输出文件名,需要输出到JS文件夹下路径加在了filename中
    //publicPath: '/', //指定引用路径,在服务器模式下使用才会表现正常
    sourceMapFilename: '[file].map'
    
  },

  module: {
    //noParse选项配置不需要解析的目录和文件
    //noParse: [ path.join(__dirname + '/client/node_modules/jquery/'), path.join(__dirname + '/client/lib/**') ], 

    //加载器配置
    loaders: [
      /*
      {
        //test : 匹配所处理文件的拓展名的正则表达式（必须）
        //css-loader编译的文件会被打包进JS中, JS再写成内联样式在html中;
        //这里使用插件提取出来
        test: /\.css$/,  

        //loader : 名称（必须）,可省略 -loader 尾缀, 感叹号为分隔符
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!postcss',{
          publicPath: '../' //指定引用路径,用于修正抽取css文件中的图片路径
        }),
            
        //include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
        include : srcDir

        //query：为loaders提供额外的设置选项（可选）
      },
      */
      {test: /\.css$/, loader: cssLoader},
      {test: /\.scss$/, loader: sassLoader},
      {test: /\.json$/, loader: "json"},
      {
        test: /\.js$/,
        exclude: /node_modules|lib/,
        loader: 'babel',
        query: {
          presets: ['es2015','react']
        }
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
            "style-loader",
            "css-loader!less-loader"
        )
      }, 
      {
        //图片处理,必须要在js中引用, 大小小于limit的图片会被转为base64格式;
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        loaders: [
          //小于10KB的图片会自动转成dataUrl，
          'url?limit=10240&name=img/[name].[hash:8].[ext]',
          'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
        ]
        //loader: "url-loader?limit=1024&name=img/[name].[ext]"
        //loader: 'file-loader?name=img/[name].[ext]'
      },
      { 
        test: /\.(eot|ttf)(\?.*)?$/,  
        loader: 'url-loader?importLoaders=1&limit=10240&name=fonts/[name].[hash:8].[ext]' 
      },
      {
        //处理vue
        test: /\.vue$/,
        loader: 'vue-loader'
      }
      
    ]
    
  },

  postcss: [
    require('autoprefixer')//调用autoprefixer插件
  ],

  //插件项
  plugins: plugins,

  //添加了此项，则表明从外部引入，内部不会打包合并进去
  externals: {
      //jquery: 'window.jQuery',
      //...
  },
  //resolve 定义应用层的模块（要被打包的模块）的解析配置
  resolve: {

    root: [srcDir, nodeModPath], //定义根路径, 需使用绝对路径,

    fallback: path.join(__dirname, "node_modules"),
    
    extensions: ['', '.js', '.json','.es6','.jsx','css','.scss','png','jpg','jpeg'],
    
    //定义引用路径的别名
    alias: {
        jquery : path.join(srcDir,'js/lib','jquery-2.1.4.js'), //在定义root后可使用相对路径
        vue : path.join(srcDir,'js/lib','vue-2.1.6.js'), 
        loadash : path.join(srcDir,'js/lib','lodash-4.17.2.js'),
        publicPath: '/'
    }
  },

  //resolveLoader 用来配置 loader 模块的解析
  resolveLoader: { fallback: path.join(__dirname, "node_modules") }

}
