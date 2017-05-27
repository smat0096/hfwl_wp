'use strict';

var gulp = require('gulp');
var path = require('path');

var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var browserSync = require('browser-sync').create(); //浏览器同步热更新
var webpackConfig = require('./webpack.config.allinone.js');

//用于gulp传递参数
var minimist = require('minimist');
var gutil = require('gulp-util');
var clean = require('gulp-clean');

  //读取参数
var env = {
        string: 'env',
        default: {env: process.env.NODE_ENV || 'debug'}
    };
env = minimist(process.argv.slice(2), env).env; 
//env: 
//debug[默认] 本地开发 webpack-dev-server , 
//build 本地编译构建 browser-sync , 
//product 服务器构建[替换url并压缩] 

//设置路径
var config = require('./config.js');
config.env = env;
gutil.log('mode : ', env);
(env === 'debug' || env === 'build') && (config.path.publicPath = '');
//配置webpack
var webpackCompiler = webpackConfig( config );

//check code
gulp.task('hint', function () {
    var jshint = require('gulp-jshint')
    var stylish = require('jshint-stylish')
    return;
    return gulp.src(config.path.srcBabel)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
})

//browser-sync 热测试
gulp.task('browser-sync',function() {
  var files = [
    path.join( config.path.dest, '/**')
  ];
  browserSync.init(files,{
    injectChanges: false,
    watchOptions: {
        ignoreInitial: true
    },
    notify: false, //禁止通知
    reloadDebounce: 500, //热重载间隔
    server: {
      baseDir: config.path.dest,
      //index: config.path.browserIndex,
      //startPath: config.path.browserStartPath,
      port :  config.port
    }
  });
});

//清理目录
gulp.task("clean", ['hint'], function (done) {
    //return cache.clearAll(done);
    return gulp.src(config.path.dest, {
        read: false
    })
    .pipe(clean({force: true}));
});

//run webpack build
gulp.task('webpack-build', ['clean'], function (done) {
    webpack( webpackCompiler , function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err)
        gutil.log('[webpack-build]', stats.toString({colors: true}))
        done()
    });
});

//run webpackDevServer
gulp.task('webpack-dev-server',  function (done) {
    webpackCompiler.entry.index = webpackCompiler.entry.index || [];
    webpackCompiler.entry.index.unshift("webpack-dev-server/client?http://localhost:"+config.port);  // 将执替换js内联进去
    webpackCompiler.entry.index.unshift("webpack/hot/dev-server"); // HMR 更新失败之后会刷新整个页面;webpack/hot/only-dev-server配置会要求手动刷新
    /*"server": "webpack-dev-server --progress --colors --hot --inline",*/
    new webpackDevServer(webpack(webpackCompiler), {
          hot: true , 
          stats: { colors: true },
          historyApiFallback: true
    }).listen(config.port, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server 启动失败:', err);
        }
        gutil.log('[webpack-dev-server 启动成功:]', 'http://localhost:' +config.port);
    });
});

gulp.task('browser-sync-server',['webpack-build', 'watch'],function(){
  return gulp.start('browser-sync')
});

gulp.task('upload', function () {
    var _conf = env === 'remote' ? config.remoteServer : config.localServer;
    return gulp.src(path.join(config.path.dest , './**'))
        .pipe(sftp(_conf))
        .pipe(gutil.noop());
});

gulp.task('watch', function () {  
   return gulp.watch(config.path.srcAll, ['webpack-build']);  
});

gulp.task('product',['webpack-build'],function(){
  //return gulp.start('upload')
});

gulp.task('default',function(){
  if( env === 'debug'){
    gulp.start('webpack-dev-server');
  } else if( env === 'build'){
    gulp.start('browser-sync-server');
  } else if( env === 'product'){
    gulp.start('product');
  }
});
