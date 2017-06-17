'use strict';

var gulp = require('gulp');
//gulp工具
var runSequence = require('run-sequence');//同步执行
var minimist = require('minimist');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var path = require('path');
var merge = require('webpack-merge');

var opn = require('opn'); //打开页面;
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var browserSync = require('browser-sync').create(); //移动端浏览器同步

//读取配置
var webpackConfigBase = require('./config/webpack.config.base.js');
var config = require('./config/config.base.js');
var localConfig = require('./config/config.local.js');
var remoteConfig = require('./config/config.remote.js');

//初始化webpack配置项;
var _opts = {
        string: 'env',
        default: {env: process.env.NODE_ENV || 'development'}
    };
_opts = minimist(process.argv.slice(2), _opts);
config.env = process.env.NODE_ENV || _opts.env;
config.act = _opts._[0] || 'webpack-dev-middleware';

var webpackConfAdd = {};
switch(config.act){
  case 'webpack-dev-server' :
    config.url = localConfig.url;
    config.server = localConfig.server;
    webpackConfAdd = require('./config/webpack.config.dev.js')(config);
    break;
  case 'webpack-dev-middleware' :
    config.url = remoteConfig.url; //设置代理获取远程数据
    config.server = localConfig.server;
    webpackConfAdd = require('./config/webpack.config.mid.js')(config);
    break;
  case 'browser-sync-server' :
    config.url = localConfig.url;
    config.server = localConfig.server;
    webpackConfAdd = require('./config/webpack.config.prod.js')(config);
    break;
  case 'build' :
    config.url = remoteConfig.url;
    config.server = remoteConfig.server;
    webpackConfAdd = require('./config/webpack.config.prod.js')(config);
    break;
  default:
    throw new gutil.PluginError('运行参数错误!!!',config.act);
    break;
}
var webpackConfig = merge( webpackConfigBase(config), webpackConfAdd );
gutil.log(_opts , `[config.act : ${config.act} ] ,[config.env : ${config.env} ]`);

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
    return gulp.src(config.dest.path, { read: false })
    .pipe(clean({force: true}));
});

//run webpack build
gulp.task('build', ['clean'], function (done) {
    webpack( webpackConfig , function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err)
        gutil.log('[build]', stats.toString({colors: true}))
        done()
    });
});

//webpack-dev-server
gulp.task('webpack-dev-server',  function (done) {
    var uri = 'http://localhost:' +config.server.port;
    Object.keys(webpackConfig.entry).forEach(function (name) {
      if (!(webpackConfig.entry[name] instanceof Array)) {
          throw new gutil.PluginError('entry[name] 需为 Array');
      }
      webpackConfig.entry[name].unshift("webpack-dev-server/client?http://localhost:"+config.server.port, path.resolve(process.cwd(), "node_modules/webpack/hot/dev-server"));
    })
    new webpackDevServer(webpack(webpackConfig), {
          hot: true ,
          stats: { colors: true },
          historyApiFallback: true
    }).listen(config.server.port, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server 启动失败:', err);
        }
        gutil.log('[webpack-dev-server 启动成功:]', uri);
        //执行回调,打开页面, 不知为何放到 webpack(webpackConfig,()=>{opn(uri)})中会编译错误;
        !!config.autoOpenBrowser && opn(uri);
        done();
    });
});

//webpack-dev-middleware
gulp.task('webpack-dev-middleware',  function (done) {
  require('./config/webpack-dev-middleware.js')(config,webpackConfig);
  done();
})

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
  browserSync.reload(); // 需要为文件设置hash才能实现自动刷新, 原因未知
  done();
});

gulp.task('default',['webpack-dev-middleware'],function(done){
  done();
});
