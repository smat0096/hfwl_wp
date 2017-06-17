'use strict';
var localConfig = {
    publicPath : '', //基础路径
    //本地服务器配置 webpack-dev-server 和 browser-sync
    server : {
      port : 3000,
      index : 'index.html',
      startPath : '/loading.html'
    },
    //本地服务器数据接口
    url : {
      basicUrl : '', //基础路径, 下次改为 publicPath; TODO;
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

      user_post_address: 'static/json/userSettingN.json', // [发送位置]

      //业务员
      business_r_get: 'static/json/business.json' // [业务员 推荐记录]
    }
};

module.exports = localConfig;
