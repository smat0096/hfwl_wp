'use strict';

var gulp = require('gulp');
var path = require('path');

var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var browserSync = require('browser-sync').create(); //移动端浏览器同步热更新
var webpackConfig = require('./webpack/webpack.config.base.js');
var config = require('./webpack/config.js');
//用于gulp传递参数
var runSequence = require('run-sequence');//同步执行
var minimist = require('minimist');
var gutil = require('gulp-util');
var clean = require('gulp-clean');

  //读取参数
var env = {
        string: 'env',
        default: {env: process.env.NODE_ENV || 'dev'}
    };
env = minimist(process.argv.slice(2), env).env; 
//env: 
//dev[默认] 本地开发 webpack-dev-server , 
//brower 本地编译构建 browser-sync , 
//product 服务器构建[替换url并压缩] 

config.env = env;
config.debug = (env === 'dev' || env === 'browser');
config.debug && (config.publicPath = '');
gutil.log('env : ', config.env, ' ; debug :',config.debug);
//配置webpack
var webpackCompiler = webpackConfig( config );

//check code
gulp.task('hint', function () {
    var jshint = require('gulp-jshint')
    var stylish = require('jshint-stylish')
    return;
    return gulp.src(config.src.babel)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
})

//清理目录
gulp.task("clean", ['hint'], function (done) {
    //return cache.clearAll(done);
    return gulp.src(config.dest.path, {
        read: false
    })
    .pipe(clean({force: true}));
});

//run webpack build
gulp.task('build', ['clean'], function (done) {
    webpack( webpackCompiler , function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err)
        gutil.log('[build]', stats.toString({colors: true}))
        done()
    });
});

//run webpackDevServer
gulp.task('webpack-dev-server',  function (done) {
    // Object.keys(webpackCompiler.entry).forEach(function (name) {
    //   webpackCompiler.entry[name] = ['./build/dev-client'].concat(webpackCompiler.entry[name])
    // })
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

//browser-sync 热测试
gulp.task('browser-sync',['build'],function() {
  browserSync.init({
    server: {
      baseDir: config.dest.path,
      //index: config.browser.index,
      //startPath: config.browser.startPath,
      port :  config.port
    }
  });
  gulp.start('watch');
});

gulp.task('upload', function () {
    var _conf = env === 'remote' ? config.remoteServer : config.localServer;
    return gulp.src(path.join(config.dest.path , './**'))
        .pipe(sftp(_conf))
        .pipe(gutil.noop());
});

gulp.task('watch', function () {  
   return gulp.watch(
    [
      path.join(config.src.path,'./**/*.js'), 
      path.join(config.src.path,'./**/*.css'), 
      path.join(config.src.path,'./**/*.html'), 
    ],
    ['reload']
  );  
});

gulp.task('reload', ['build'], function(done){
  gulp.start('watch');
  browserSync.reload();
  done();
});

gulp.task('product',['build'],function(){
  //return gulp.start('upload')
});

gulp.task('default',function(){
  if( env === 'dev'){
    gulp.start('webpack-dev-server');
  } else if( env === 'browser'){
    gulp.start('browser-sync');
  } else if( env === 'product'){
    gulp.start('product');
  }
});
