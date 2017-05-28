'use strict';
var path = require('path'),
    glob = require('glob'),
    gutil = require('gulp-util');

var srcPath = path.resolve('./src/'),
    destPath = path.resolve(process.cwd(), './dest/'), //绝对路径 ,不要用 __dirname 文件所在目录
    nodeModPath = path.resolve(process.cwd(), './node_modules');

var config = {
    port : 3000,
    publicPath : '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl/',
    src : {
      path : srcPath,
      html : path.join(srcPath , './index.html'),
      static : path.resolve(srcPath, './static/'),
      babel : [
        path.join(srcPath , 'staticBase/js/component/**/*.js'),
        path.join(srcPath , 'staticBase/js/pages/**/*.js'),
        path.join(srcPath , 'staticBase/js/utils/**/*.js'),
        path.join(srcPath , 'staticBase/js/router/**/*.js'),
        path.join(srcPath , 'staticBase/js/store/**/*.js')
      ],
    },
    dest : {
      path : destPath,
      static : path.resolve(destPath, './static/'),
    },
    //browser-sync 配置
    browser: {
      index : 'index.html',
      startPath : '/loading.html'
    },
    alias : {
          'jquery' : path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/jquery-2.1.4.js'),
          'art-template' : path.join(srcPath , 'staticBase/js/lib/art-template/template-web.js'),
          'jquery-weui' : path.join(srcPath , 'staticBase/js/lib/jquery-weui/js/jquery-weui.min.js'),
          'fastclick' : path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/fastclick.js'),
          'vue' : path.join(srcPath , 'staticBase/js/lib/vue/vue-2.2.0.min.js'),
          'vuex' : path.join(srcPath , 'staticBase/js/lib/vue/vuex.min.js'),
          'vue-router' : path.join(srcPath , 'staticBase/js/lib/vue/vue-router-2.1.1.min.js')
    },
    entry : {
      'index' : [
          path.join(srcPath , 'staticBase/js/base.js'),
          path.join(srcPath , 'staticBase/js/pages/index.js')
      ],
      'vendor' : [
          path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/jquery-2.1.4.js'),
          path.join(srcPath , 'staticBase/js/lib/art-template/template-web.js'),
          path.join(srcPath , 'staticBase/js/lib/jquery-weui/js/jquery-weui.min.js'),
          path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/fastclick.js'),
          path.join(srcPath , 'staticBase/js/lib/vue/vue-2.2.0.min.js'),
          path.join(srcPath , 'staticBase/js/lib/vue/vuex.min.js'),
          path.join(srcPath , 'staticBase/js/lib/vue/vue-router-2.1.1.min.js')
      ]
    },
    //远程服务器
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
