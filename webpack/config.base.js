'use strict';
var path = require('path');

var srcPath = path.resolve('./src/'),
    destPath = path.resolve(process.cwd(), './dest/'), //绝对路径 ,不要用 __dirname 文件所在目录
    nodeModPath = path.resolve(process.cwd(), './node_modules');

var config = {
    src : {
      path : srcPath,
      html : path.join(srcPath , './index.html'),
      babel : [
        path.join(srcPath , 'staticBase/js/component/**/*.js'),
        path.join(srcPath , 'staticBase/js/pages/**/*.js'),
        path.join(srcPath , 'staticBase/js/utils/**/*.js'),
        path.join(srcPath , 'staticBase/js/router/**/*.js'),
        path.join(srcPath , 'staticBase/js/store/**/*.js')
      ],
    },
    dest : {
      path : destPath
    },
    //别名
    alias : {
          // 'jquery' : path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/jquery-2.1.4.js'),
          // 'art-template' : path.join(srcPath , 'staticBase/js/lib/art-template/template-web.js'),
          // 'jquery-weui' : path.join(srcPath , 'staticBase/js/lib/jquery-weui/js/jquery-weui.min.js'),
          // 'fastclick' : path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/fastclick.js'),
          // 'vue' : path.join(srcPath , 'staticBase/js/lib/vue/vue-2.2.0.min.js'),
          // 'vuex' : path.join(srcPath , 'staticBase/js/lib/vue/vuex.min.js'),
          // 'vue-router' : path.join(srcPath , 'staticBase/js/lib/vue/vue-router-2.1.1.min.js'),

          //文件别名
          'basicUrl' : srcPath,
          'commonUrl' : path.join(srcPath , '/staticBase/js'),
          'city' : path.join(srcPath , '/staticBase/js/city'),
          'dialog'  : path.join(srcPath , '/staticBase/js/dialog'),
          'plug' : path.join(srcPath , '/staticBase/js/plug'),
          'tpl'  : path.join(srcPath , '/staticBase/js/tpl'),
          'component' : path.join(srcPath , '/staticBase/js/component'),
          'pages' : path.join(srcPath , '/staticBase/js/pages'),
          'utils' : path.join(srcPath , '/staticBase/js/utils'),
          //路径别名
          'commonBase' : path.join(srcPath , '/staticBase/js/commonBase'),
          'siteHash' : path.join(srcPath , '/staticBase/js/city/siteHash.js'),
          'site' : path.join(srcPath , '/staticBase/js/city/site.js'),
          'demoCity' : path.join(srcPath , '/staticBase/js/city/demo_city.js'),
          'positionHash' : path.join(srcPath , '/staticBase/js/city/positionHash.js'),

          'ksmap': path.join(srcPath , '/staticBase/js/utils/ksmap/ks_map.js'),
          'ksvalidata': path.join(srcPath , '/staticBase/js/utils/ksvalidate/ks_validate.js'),
          'ksvalidata_regs': path.join(srcPath , '/staticBase/js/utils/ksvalidate/ks_validate_regs.js'),

          'fhIssue_new': path.join(srcPath , '/staticConsignorSendMS/js/fhIssue_new')
    },
    //入口文件
    entry : {
      'index' : [
          path.join(srcPath , 'staticBase/js/base.js'),
          path.join(srcPath , 'staticBase/js/index.js')
      ],
      // 'vendor' : [
      //     path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/jquery-2.1.4.js'),
      //     path.join(srcPath , 'staticBase/js/lib/art-template/template-web.js'),
      //     path.join(srcPath , 'staticBase/js/lib/jquery-weui/js/jquery-weui.min.js'),
      //     path.join(srcPath , 'staticBase/js/lib/jquery-weui/lib/fastclick.js'),
      //     path.join(srcPath , 'staticBase/js/lib/vue/vue-2.2.0.min.js'),
      //     path.join(srcPath , 'staticBase/js/lib/vue/vuex.min.js'),
      //     path.join(srcPath , 'staticBase/js/lib/vue/vue-router-2.1.1.min.js')
      // ]
    }
};

module.exports = config;
