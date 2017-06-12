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
var webpackConfigBase = require('./webpack/webpack.config.base.js');
var config = require('./webpack/config.base.js');
var localConfig = require('./webpack/config.local.js');
var remoteConfig = require('./webpack/config.remote.js');

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
    webpackConfAdd = require('./webpack/webpack.config.dev.js')(config);
    break;
  case 'webpack-dev-middleware' :
    config.url = remoteConfig.url; //设置代理获取远程数据
    config.server = localConfig.server;
    webpackConfAdd = require('./webpack/webpack.config.mid.js')(config);
    break;
  case 'browser-sync-server' :
    config.url = localConfig.url;
    config.server = localConfig.server;
    //webpackConfAdd = require('./webpack/webpack.config.prod.js')(config);
    break;
  case 'build' :
    config.url = remoteConfig.url;
    config.server = remoteConfig.server;
    webpackConfAdd = require('./webpack/webpack.config.prod.js')(config);
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
  //设置代理跨域  https://github.com/chimurai/http-proxy-middleware
  config.proxyTable = {
    '/app': {
      target: 'http://cwh.qiruiw.com',
      changeOrigin: true,
      pathRewrite: {
        '^/app': '/app'
      },
      //设置cookie
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('cookie', 'Hm_lvt_76e0f7fba99c643ac87df5b4822a2932=1493011547,1493011552,1493794769,1494485427; ab46___ewei_shopv2_member_session_2=eyJpZCI6IjcwIiwib3BlbmlkIjoid2FwX3VzZXJfMl8xMzMzMzMzMzMzMiIsIm1vYmlsZSI6IjEzMzMzMzMzMzMyIiwicHdkIjoiZWMxMmFkYWY0M2JhNjgwMmNjMDU0M2MxMGIxYzQ5M2IiLCJzYWx0IjoiUEY0Wk9HWkdaMlZETjNHTyIsImF1ZGl0VHlwZSI6IjEiLCJld2VpX3Nob3B2Ml9tZW1iZXJfaGFzaCI6IjdhMjFkZTE2ZWU1ZmI5ZWZmMGQxZGE2NWQyZjQxMWMyIn0%3D; PHPSESSID=dd0314d1b8a34af27d35a29e9db692cc')
      },
      onProxyRes(proxyRes, req, res){
        Object.keys(proxyRes.headers).forEach(function (key) {
          res.append(key, proxyRes.headers[key]);
        });
      }
    }
  };
  require('./webpack/webpack-dev-middleware.js')(config,webpackConfig);
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
