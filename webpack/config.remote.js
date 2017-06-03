'use strict';
var path = require('path'),
    gutil = require('gulp-util');

var remoteUrlBase = '/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile';//服务器接口基础路径;

var remoteConfig = {
    //远程服务器上传配置
    server : {
        host: '211.149.183.58',
        port : '21',
        remotePath: '/',
        user: 'kongshan',
        pass: '123456',
        key: '~/.ssh/id_rsa',
        timeout : 10000,
        callback : function(){
            gutil.log('上传完成!!!');
        },
        publicPath : '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl/'
    },
    //远程服务器数据接口
    url : {
      publicPath : '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl/', //服务器文件基础路径
      basicUrl : '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl/', //服务器文件基础路径
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

module.exports = remoteConfig;
