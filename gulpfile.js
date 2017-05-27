'use strict';
var gulp = require('gulp'),//gulp基础库
    
    clean = require("gulp-clean"),//清理目录

    replace = require('gulp-replace'),//文本替换
    replace_url = require('gulp-url-replace'),//文本替换2
    rename = require('gulp-rename'),//重命名文件
    rev = require('gulp-rev'), //缓存相关,生成hash码
    RevAll = require('gulp-rev-all'),
    concat = require('gulp-concat'),//合并文件
    order = require("gulp-order"), //合并的排序功能
    addsrc = require('gulp-add-src'),//添加额外的文件流
    filter = require ('gulp-filter'), //过滤文件流

    uglify = require('gulp-uglify'),//压缩js
    jshint = require('gulp-jshint'), //jshint检查
    jscs = require('gulp-jscs'),  //jscs检查
    babel = require('gulp-babel'), //ES6,react等的编译

    seaConcat = require('gulp-seajs-concat'), //seajs拼接
    seaTransport = require('gulp-seajs-transport'), //seajs改路径Id
    
    cssmin = require('gulp-minify-css'),//压缩css
    csso = require('gulp-csso'),//压缩css
    autoprefixer = require('gulp-autoprefixer'), // 添加 CSS 浏览器前缀

    htmlmin = require("gulp-htmlmin"),//压缩html
    useref = require('gulp-useref'), //处理文件链接, herf等url
    processhtml = require('gulp-processhtml'),//处理html文件
    
    imagemin = require('gulp-imagemin'), // 图片优化
    tobase64 = require('gulp-tobase64'), //图片转base64
    plumber = require('gulp-plumber'),//捕获错误;

    gulpif = require('gulp-if'), //条件判断
    gutil = require('gulp-util'), //打印信息等工具
    minimist = require('minimist'), //读取命令行传参数
    path = require('path'), //路径
    glob = require('glob'), //遍历
    
    connect = require('gulp-connect'), //搭建本地服务器
    sftp = require('gulp-sftp'), //同步远程服务器1
    ftp = require('gulp-ftp'), //同步远程服务器2
    browserSync = require('browser-sync').create(); //浏览器同步热更新
    

  //读取参数
var gulpOptions = {
        string: 'env',
        default: {env: process.env.NODE_ENV || 'debug'}
    };
    gulpOptions = minimist(process.argv.slice(2), gulpOptions);

var buildMode = gulpOptions.env; //buildMode: debug[默认] 本地开发 , build 本地编译构建 , server 服务器构建[替换link和src] 
    gutil.log('buildMode : ' + buildMode);

var paths = require('./gulpPaths.js');

paths.browser = buildMode === 'debug' ? paths.src : paths.dest;

//paths.srcJs = paths.srcJs.concat(paths.srcBabel.map(function(_path){ return '!'+_path }));

//图片转 base64配置;
var tobase64Options = {
    log : 1, //是否输出log, 默认值为1
    maxsize:20, //kb
    ignore:'image_loading.png', //过滤图片 {RegExp|Array|String}
    pathrep: {  //将路由地址的图片路径替换成相对地址,格式为{reg:'',rep:''}
        reg:/\/public\/bizapp\d*\//g , //用于匹配替换的正则
        rep:'./public/'
    }
}

//清理目录
gulp.task("clean", function (done) {
    //return cache.clearAll(done);
    return gulp.src(paths.dest, {
        read: false
    })
    .pipe(clean({force: true}));
});

//需要合并和压缩并增加的文件
// gulp.task('concat', function () {
//     gulp.src([
//         paths.src + '/js/libs/angular.min.js',
//         paths.src + '/js/libs/*.js',
//         '!' + paths.src + '/js/libs/bridge*.js'
//     ])
//         .pipe(concat('libs.min.js'))
//         .pipe(uglify())
//         .pipe(addsrc(paths.src + '/js/libs/bridge*.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest(paths.dest + "/js/libs/"))
// });




gulp.task('build',['clean'], function () {  
  
  var jsFilter = filter(paths.srcJs,{restore: true});
  var babelFilter = filter(paths.srcBabel,{restore: true});
  var jsStaticFilter = filter(paths.srcJsStatic,{restore: true});

  var cssFilter = filter(paths.srcCss,{restore: true});  
  var htmlFilter = filter(paths.srcHtml,{restore: true}); 
  var htmlFilter_index = filter(paths.srcHtml_index,{restore: true}); 
  var imgFilter = filter(paths.srcImg,{restore: true}); 
  var seaMainFilter = filter(paths.seaMain,{restore: true}); 

  return gulp.src(paths.srcAll)  
        
    /* 主页处理 , 替换链接  */
    .pipe(htmlFilter_index)   
    .pipe(useref()) //可以把html里零碎的这些引入合并成一个文件，当然 它只负责合并，不负责压缩 
    .pipe(gulpif(buildMode === 'server',replace('\=\"\.\/','=\"'+paths.server))) //将相对路径 ="./ 替换为服务器路径
    .pipe(htmlFilter_index.restore) 

    /* html处理  */
    .pipe(htmlFilter)
    //.pipe(tobase64(tobase64Options))//转换图片,html无此需求
    .pipe(processhtml())
    .pipe(htmlmin({ //压缩html
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    }))
    .pipe(htmlFilter.restore)  

    /* seaJs处理*/
    // .pipe(seaMainFilter) 
    // .pipe(seaMainFilter.restore)

    /* babel处理  */
    .pipe(babelFilter)  
    .pipe(babel({
      presets: ['es2015','latest',"stage-3"] //"react"
    }))
    .pipe(babelFilter.restore)

    //.pipe(jsStaticFilter)
    //.pipe(order(paths.srcJsStatic)) //排序,注意paths定义时的排序;
    // .pipe(uglify({ //压缩
    //         mangle: {except: ['require' ,'exports' ,'module' ,'$']},//默认：true 是否修改变量名,或者哪些变量名
    //         compress: true,//类型：Boolean 默认：true 是否完全压缩
    //         preserveComments: false//'all' //保留所有注释
    // }))
    //.pipe(concat('libs.js'))//连接js;
    // .pipe(rev()) //文件名加MD5后缀
    // .pipe(gulp.dest(paths.destJsStatic))//输出文件 不输出的话, 默认输出合并的第一个文件位置[未压缩],还会输出到根目录一份[压缩]
    // .pipe(rev.manifest())  //- 生成一个rev-manifest.json
    // .pipe(gulp.dest(paths.destJsStatic+'/rev'))   //- 将 rev-manifest.json 保存到 rev 目录内
    //.pipe(jsStaticFilter.restore)  

    /* JS处理 */
    .pipe(jsFilter)
    //.pipe(jshint()) //jshint检查
    //.pipe(jshint.reporter('default')) //打印报告
    //.pipe(jscs())   //jscs风格检查
    .pipe(seaTransport()) //seaJs模块处理 先转换具名模块
    //.pipe(seaConcat({ base : '/' })) //seaJs模块处理 再合并
    .pipe(uglify({ //压缩
            mangle: {except: ['require' ,'exports' ,'module' ,'$','jQuery','define']},//默认：true 是否修改变量名,或者哪些变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: false//'all' //保留所有注释
    }))
    .pipe(jsFilter.restore)  


    /* CSS处理 */
    // .pipe(cssFilter)
    // .pipe(order(paths.srcCss)) //排序,注意paths定义时的排序;
    // .pipe(concat('main.css'))//合并css;
    // .pipe(tobase64(tobase64Options)) //图片转码
    // .pipe(autoprefixer('last 6 version')) //自动兼容css3前缀
    // .pipe(cssmin()) //压缩
    // .pipe(csso()) //压缩
    // .pipe(rev()) //文件名加MD5后缀 临时输出不生成md5的话, 会排序错误,原因未知
    // .pipe(gulp.dest(paths.destCss))//输出文件 不输出的话, 默认输出合并的第一个文件位置[未压缩],还会输出到根目录一份[压缩]
    // .pipe(rev.manifest())  //- 生成一个rev-manifest.json
    // .pipe(gulp.dest(paths.destCss+'/rev'))   //- 将 rev-manifest.json 保存到 rev 目录内
    // .pipe(cssFilter.restore)

    /* image 图片处理, 慎用 */
    /*
    .pipe(imgFilter)
    .pipe(imagemin())
    .pipe(imgFilter.restore)
    */
   
    /* 加MD5后缀 慎用 不兼容 require seaJs等 */
    // .pipe(RevAll.revision({   
    //   //不重命名文件  
    //   dontRenameFile: ['.html','.js','.json'] ,  
    //   //无需关联处理文件  
    //   dontGlobal: [ /\/favicon.ico$/ ,'.bat','.txt','.js'],
    //   //不去跟新html的引用
    //   dontUpdateReference: ['.html','.js'],
    //   //前缀,该项配置只影响绝对路径的资源  
    //   //prefix: 'http://s0.static.server.com'
    // }))
    
   
    //输出  
    .pipe(gulp.dest(paths.dest))

    //生成映射json文件  
    // .pipe(RevAll.manifestFile())  
    // .pipe(gulp.dest(paths.dest));  

});  

gulp.task('watch', function () {  
   gulp.watch(paths.srcAll, ['build']);  
});

//browser-sync 热测试
gulp.task('browser-sync',function() {
  var files = [
    path.join(paths.browser, '/**')
  ];
  browserSync.init(files,{
    injectChanges: false,
    watchOptions: {
        ignoreInitial: true
    },
    notify: false, //禁止通知
    reloadDebounce: 500, //热重载间隔
    server: {
      baseDir: paths.browser,
      //index: paths.browserIndex,
      //startPath: paths.browserStartPath,
      port : 3000
    }
  });
});

gulp.task('browser-sync-build',['build', 'watch'],function(){
  gulp.start('browser-sync')
});

gulp.task('upload', function () {
    var _conf = buildMode === 'server' ? paths.remoteServer : paths.localServer;
    return gulp.src(path.join(paths.dest , './**'))
        //.pipe(sftp(_conf))
        .pipe(ftp(_conf))
        .pipe(gutil.noop());
});

gulp.task('server',['build'],function(){
  //return gulp.start('upload')
});

gulp.task('default',function(){
  if( buildMode === 'debug'){
    gulp.start('browser-sync');
  } else if( buildMode === 'build'){
    gulp.start('browser-sync-build');
  } else if( buildMode === 'server'){
    gulp.start('server');
  }
});
