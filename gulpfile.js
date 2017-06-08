'use strict';

var gulp = require('gulp');
var path = require('path');
var opn = require('opn'); //打开页面;
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var browserSync = require('browser-sync').create(); //移动端浏览器同步热更新

var webpackConfig = require('./webpack/webpack.config.base.js');
var config = require('./webpack/config.base.js');
var localConfig = require('./webpack/config.local.js');
var remoteConfig = require('./webpack/config.remote.js');
//用于gulp传递参数
var runSequence = require('run-sequence');//同步执行
var minimist = require('minimist');
var gutil = require('gulp-util');
var clean = require('gulp-clean');

//读取参数
//格式化webpack配置项;
var _opts = {
        string: 'env',
        default: {env: process.env.NODE_ENV || 'development'}
    };
_opts = minimist(process.argv.slice(2), _opts);
config.env = _opts.env;
config.act = _opts._[0] || 'webpack-dev-server';
if(config.env === 'development'){
  config.debug = true;
  config.url = localConfig.url;
  config.server = localConfig.server;
}else{
  config.debug = false;
  config.url = remoteConfig.url;
  config.server = remoteConfig.server;
}
gutil.log(_opts, config.env, config.act);
var webpackCompiler = webpackConfig( config );

//check code
gulp.task('hint', function () {return;
    var jshint = require('gulp-jshint')
    var stylish = require('jshint-stylish')
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

//webpack-dev-server
gulp.task('webpack-dev-server',  function (done) {
    // Object.keys(webpackCompiler.entry).forEach(function (name) {
    //   webpackCompiler.entry[name] = ['./build/dev-client'].concat(webpackCompiler.entry[name])
    // })
    webpackCompiler.entry.index = webpackCompiler.entry.index || [];
    webpackCompiler.entry.index.unshift("webpack-dev-server/client?http://localhost:"+config.server.port);  // 将执替换js内联进去
    webpackCompiler.entry.index.unshift("webpack/hot/dev-server"); // HMR 更新失败之后会刷新整个页面;webpack/hot/only-dev-server配置会要求手动刷新
    /*"server": "webpack-dev-server --progress --colors --hot --inline",*/
    new webpackDevServer(webpack(webpackCompiler), {
          hot: true ,
          stats: { colors: true },
          historyApiFallback: true
    }).listen(config.server.port, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server 启动失败:', err);
        }
        gutil.log('[webpack-dev-server 启动成功:]', 'http://localhost:' +config.server.port);
        //编译完成后执行回调,打开页面
        opn('http://localhost:' +config.server.port);
        done();
    });
});

//browser-sync-server
gulp.task('browser-sync-server',['build'],function() {
  browserSync.init({
    server: {
      baseDir: config.dest.path,
      //index: config.server.index,
      //startPath: config.server.startPath,
      port :  config.server.port
    }
  });
  return gulp.start('watch');
});

gulp.task('upload', function () {
    return gulp.src(path.join(config.dest.path , './**'))
        .pipe(sftp(config.server))
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

gulp.task('default',['webpack-dev-server'],function(done){
  done();
});
