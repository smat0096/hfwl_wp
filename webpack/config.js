'use strict';
var path = require('path'),
    glob = require('glob'),
    gutil = require('gulp-util');

var srcPath = path.resolve('./src/'),
    destPath = path.resolve(process.cwd(), './dest/'), //绝对路径 ,不要用 __dirname 文件所在目录
    nodeModPath = path.resolve(process.cwd(), './node_modules');

var remoteUrlBase = '/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile',//接口基础路径;
    publicPath = '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl/'; //服务器文件基础路径

var config = {
    port : 3000,
    publicPath : publicPath,
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
          'vue-router' : path.join(srcPath , 'staticBase/js/lib/vue/vue-router-2.1.1.min.js'),

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
    },
    //局域网服务器
    localServer : {
        host: '192.168.56.130',
        port : '80',
        remotePath: '/data/website/website1',
        user: 'root',
        pass: 'password'
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
    //数据接口
    localUrl : {
      basicUrl : '',
      index : '/',
      //login
      login : '/',// [登录页面]
      logout : '/',  //退出

      //查看货源
      findgoods_get : 'static/json/find.json',// [获取数据]
      findgoods_post_browseCount : 'static/json/find.json',// [发送点击数据]
      findgoods_post_addcontact : 'static/json/find.json',

      //联系货源
      findgoodsContact_get : 'static/json/find.json', //[联系货源获取数据]

      //发布货源
      sendgoods_post : 'static/json/sendgoods.json',// [添加数据]
      sendgoods_get : 'static/json/sendgoods.json',// [获取数据]

      //发布记录
      sendgoods_r_get : 'static/json/sendgoodsR.json', //[获取数据]
      sendgoods_r_act : 'static/json/sendgoodsR.json',//[数据操作]

      //常发货源
      sendgoods_u_get : 'static/json/sendgoodsR.json', //[获取数据]
      sendgoods_u_act : 'static/json/sendgoodsR.json',//[数据操作]
      sendgoods_u_act_delete : 'static/json/sendgoodsR.json',//[数据操作][删除]

      //车源
      //手动添加熟车
      carport_addKnown: 'static/json/carportKnown.json', 

      //熟车列表
      carport_known_get : 'static/json/carportKnown.json', //[获取数据]
      carport_known_act_comment: 'static/json/carportKnown.json', //[操作备注] 所有车源列表 操作备注都用此端口
      carport_known_act_addKnown: 'static/json/carportKnown.json',//[添加/删除熟车] 
      //车源列表
      carport_source_get: 'static/json/carportKnown.json', // [获取数据]
      carport_source_act_addKnown: 'static/json/carportKnown.json', // [添加/删除熟车] 车源联系也用此端口

      carport_post_addcontact : 'static/json/find.json',//[添加联系]
      //车源联系列表
      carport_contact_get: 'static/json/carportKnown.json', // [获取数据]

      //用户
      user_get: 'static/json/userSettingN.json',  // [获取数据]
      user_comment_self: 'static/json/userSettingN.json',  //[编辑用户资料]
      user_checkMobile : 'static/json/userSettingN.json',  //验证用户手机
      user_checkBusinessMobile : 'static/json/userSettingN.json',  //验证用户手机

      user_create_driver: 'static/json/userSettingN.json', // [认证司机]  创建
      user_edit_driver: 'static/json/userSettingN.json', // [认证司机] 修改
      user_view_driver: 'static/json/userSettingN.json', // [认证司机] 查看
      
      user_edit_car: 'static/json/userSettingN.json', //  车辆信息 修改

      user_create_sender: 'static/json/userSettingN.json', // [认证货主] 创建
      user_edit_sender: 'static/json/userSettingN.json', // [认证货主] 修改
      user_view_sender: 'static/json/userSettingN.json', // [认证货主] 查看

      user_create_factory: 'static/json/userSettingN.json', // [认证货主] 创建
      user_edit_factory: 'static/json/userSettingN.json', // [认证货主] 修改
      user_view_factory: 'static/json/userSettingN.json', // [认证货主] 查看

      user_post_address: 'static/json/userSettingN.json' // [发送位置]

      //业务员
      ,business_r_get: 'static/json/business.json' // [业务员 推荐记录]
    },
    remoteUrl : {
      basicUrl : publicPath,
      index : '/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=wuliu.index',
      //login
      login : remoteUrlBase+'&r=account.login&backurl=aT0yJmM9ZW50cnkmbT1ld2VpX3Nob3B2MiZkbz1tb2JpbGUmcj13dWxpdS5pbmRleA',// [登录页面]
      logout : remoteUrlBase+'&r=account.index.logout',  //退出
      //查看货源
      findgoods_get : remoteUrlBase+"&r=wuliu.find&operation_type=findGoods",// [获取数据]
      findgoods_post_browseCount : remoteUrlBase+"&r=wuliu.find&operation_type=browseCount", //[发送点击数据]
      findgoods_post_addcontact : remoteUrlBase+"&r=wuliu.find&operation_type=addContact", //[添加联系记录] !!!
      //联系货源
      findgoodsContact_get : remoteUrlBase+'&r=wuliu.find&operation_type=ContactList', //[联系货源获取数据] !!!
      //发布货源
      sendgoods_post : remoteUrlBase+"&r=wuliu.send&operation_type=sendGoods",// 发布货源[添加数据]
      sendgoods_get : remoteUrlBase+"&r=wuliu.send&operation_type=GetSendGoods",// 发布货源[获取数据]
      //发布记录
      sendgoods_r_get : remoteUrlBase+"&r=wuliu.send&operation_type=GetSendGoodsR", //[获取数据]
      sendgoods_r_act : remoteUrlBase+"&r=wuliu.send&operation_type=sendGoodsR_Operate",//[数据操作]

      //常发货源
      sendgoods_u_get : remoteUrlBase+"&r=wuliu.send&operation_type=GetSendGoodsU", //[获取数据]
      sendgoods_u_act : remoteUrlBase+"&r=wuliu.send",//[数据操作]
      sendgoods_u_act_delete : remoteUrlBase+"&r=wuliu.send&operation_type=Often_Delete",//[数据操作][删除]

      //车源
      //手动添加熟车
      carport_addKnown: remoteUrlBase+"&r=wuliu.carport&operation_type=carport_Add", // 手动熟车
      //熟车列表
      carport_known_get : remoteUrlBase+"&r=wuliu.carport&operation_type=GetCarportKnown", //[获取数据]
      carport_known_act_comment: remoteUrlBase+"&r=wuliu.carport&operation_type=AddComment", //[操作备注] 所有车源列表 操作备注都用此端口
      carport_known_act_addKnown: remoteUrlBase+"&r=wuliu.carport&operation_type=CarportDelete",//[添加/删除熟车]

      //车源列表
      carport_source_get: remoteUrlBase+"&r=wuliu.carport&operation_type=GetCarportSource",  //[获取数据]
      carport_source_act_addKnown: remoteUrlBase+"&r=wuliu.carport&operation_type=Known_Operate", //[添加/删除熟车]

      carport_post_addcontact : remoteUrlBase+"&r=wuliu.carport&operation_type=addContact", //[添加联系记录]!!!
      //车源联系列表
      carport_contact_get: remoteUrlBase+'&r=wuliu.carport&operation_type=ContactList', // [获取数据] !!!


      //用户
      user_get: remoteUrlBase+"&r=wuliu.user&operation_type=GetUserSetting",  //[获取数据]
      user_comment_self: remoteUrlBase+"&r=wuliu.user&operation_type=AmendUser",  //[编辑用户中心资料]
      user_checkMobile : remoteUrlBase+'&r=wuliu.user&operation_type=checkMobile',  //验证用户手机
      user_checkBusinessMobile : remoteUrlBase+'&r=wuliu.user&operation_type=checkBusinessMobile',  //验证用户手机
      //发送用户信息
      user_post_address: remoteUrlBase+'&r=wuliu.user&operation_type=position', // [发送位置]

      //司机
      user_create_driver: remoteUrlBase+"&r=wuliu.user&operation_type=createDriver", // [认证司机]  创建
      user_edit_driver: remoteUrlBase+"&r=wuliu.user&operation_type=editDriver", // [认证司机] 修改
      user_view_driver: 'static/json/userSettingN.json', // [认证司机] 查看

      user_edit_car: remoteUrlBase+"&r=wuliu.user&operation_type=userCommentDriver", //  车辆信息 修改

      //货主
      user_create_sender: remoteUrlBase+"&r=wuliu.user&operation_type=createShipper", // [认证货主] 创建
      user_edit_sender:   remoteUrlBase+"&r=wuliu.user&operation_type=editShipper", // [认证货主] 修改
      user_view_sender: 'static/json/userSettingN.json', // [认证货主] 查看

      user_create_factory: 'static/json/userSettingN.json', // [认证厂家] 创建
      user_edit_factory: 'static/json/userSettingN.json', // [认证厂家] 修改
      user_view_factory: 'static/json/userSettingN.json', // [认证厂家] 查看

      business_r_get: remoteUrlBase + "&r=wuliu.Business&operation_type=GetBusinessList" // [业务员 推荐记录]
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
