'use strict';
var path = require('path'),
    glob = require('glob'),
    gutil = require('gulp-util');

var srcPath = './src/',
    destPath = './dest/';

var config = {
    
    port : 3000,
    src : srcPath,
    srcAll : path.join(srcPath , './**'),

    srcHtml : path.join(srcPath , './**/*.html'),
    srcHtml_index : path.join(srcPath , './index.html'),

    srcJs : [path.join(srcPath , './staticBase/js/**/*.js'),'!'+path.join(srcPath , './**/lib/*.js')],
    entry : {
        'base' : path.join(srcPath , 'staticBase/js/base.js'),
        'index' : path.join(srcPath , 'staticBase/js/pages/index.js')
    },
    vender : [
        path.join(srcPath , 'staticBase/js/lib/lib.js'),
        path.join(srcPath , 'staticBase/js/lib/jquery-weui/js/jquery-weui.min.js'),
        path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/fastclick.js'),
        path.join(srcPath , 'staticBase/js/lib/vue/vue-2.2.0.min.js'),
        path.join(srcPath , 'staticBase/js/lib/vue/vuex.min.js'),
        path.join(srcPath , 'staticBase/js/lib/vue/vue-router-2.1.1.min.js')
    ],
    srcBabel : [
        path.join(srcPath , 'staticBase/js/component/**/*.js'),
        path.join(srcPath , 'staticBase/js/pages/**/*.js'),
        path.join(srcPath , 'staticBase/js/utils/**/*.js'),
        path.join(srcPath , 'staticBase/js/router/**/*.js'),
        path.join(srcPath , 'staticBase/js/store/**/*.js')
    ],
    //srcCss : [path.join(srcPath , './**/*.css'),'!'+path.join(srcPath , './**/lib/*.css')],
    srcCss : [
        path.join(srcPath , './staticBase/js/lib/jquery-weui/lib/weui.min.css'),
        path.join(srcPath , './staticBase/js/lib/jquery-weui/css/jquery-weui.css'),
        path.join(srcPath , './staticBase/css/createmap.css'),
        path.join(srcPath , './staticBase/css/common.css'),
        path.join(srcPath , './staticBase/css/find.css'),
        path.join(srcPath , './staticBase/css/fhRecord.css'),
        path.join(srcPath , './staticBase/css/fhIssue_new.css'),
        path.join(srcPath , './staticBase/css/carlist.css'),
        path.join(srcPath , './staticBase/css/ks-page.css')
    ],
    srcImg : [path.join(srcPath , './img/**')],

    dest : destPath,
    destStatic : path.join(destPath , './static'),
    destJsStatic : path.join(destPath , './staticBase/js/lib'),
    destCss : path.join(destPath , './staticBase/css'),
    destImg : path.join(destPath , './img'),

    //browser-sync 配置
    browserIndex :'index.html', // 
    browserStartPath :'/loading.html', //

    //远程服务器
    publicPath : '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl/',
    remoteServer : {
        host: '211.149.183.58',
        port : '21',
        remotePath: '/',
        user: 'kongshan',
        pass: '123456',
        key: '~/.ssh/id_rsa',
        timeout : 10000,
        callback : function(){
            gutil.log('上传完成!!!');
        }
    },

    //局域网服务器
    localServer : {
        host: '192.168.56.130',
        port : '80',
        remotePath: '/data/website/website1',
        user: 'root',
        pass: 'password'
    }
};
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

module.exports = config;
