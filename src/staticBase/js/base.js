define("base",[],function(){
  var basicUrl = window.location.protocol +'\/\/'+window.location.host;
  //console.log(basicUrl)
  //全局变量
  window._G_={
    //生产模式 0 本地 [调试环境]; 1 本地文件路径,服务器数据接口[调试环境]; 2.服务器文件路径,服务器数据接口 [生产环境]
    mode : {
      status : 2,
      debug : 0,
      build : 1,
      server : 2,
    },
    //用户注册类型
    noType : 0,
    driver : 1,
    sender : 2,
    business : 3,
    factory : 4,
    //用户审核状态
    auditIng : 0,
    auditSuccess : 1,
    auditError : 2,
    auditNotyet : 3,

    //接口
    url:{}
  }

  var basicUI = basicUrl + '/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile';//接口基础路径;
  if(window._G_.mode.status == window._G_.mode.server){
    basicUrl += '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl'; //服务器文件基础路径;
  };
  /* 本地模拟数据*/
  window._G_.url={
      basicUrl : basicUrl,
      index : basicUrl,
      //login
      login : basicUrl+'/404',// [登录页面]
      logout : basicUrl,  //退出

      //查看货源
      findgoods_get : 'staticBase/json/find.json',// [获取数据]
      findgoods_post_browseCount : 'staticBase/json/find.json',// [发送点击数据]
      findgoods_post_addcontact : 'staticBase/json/find.json',

      //联系货源
      findgoodsContact_get : 'staticBase/json/find.json', //[联系货源获取数据]

      //发布货源
      sendgoods_post : 'staticBase/json/sendgoods.json',// [添加数据]
      sendgoods_get : 'staticBase/json/sendgoods.json',// [获取数据]

      //发布记录
      sendgoods_r_get : 'staticBase/json/sendgoodsR.json', //[获取数据]
      sendgoods_r_act : 'staticBase/json/sendgoodsR.json',//[数据操作]

      //常发货源
      sendgoods_u_get : 'staticBase/json/sendgoodsR.json', //[获取数据]
      sendgoods_u_act : 'staticBase/json/sendgoodsR.json',//[数据操作]
      sendgoods_u_act_delete : 'staticBase/json/sendgoodsR.json',//[数据操作][删除]

      //车源
      //手动添加熟车
      carport_addKnown: 'staticBase/json/carportKnown.json', 

      //熟车列表
      carport_known_get : 'staticBase/json/carportKnown.json', //[获取数据]
      carport_known_act_comment: 'staticBase/json/carportKnown.json', //[操作备注] 所有车源列表 操作备注都用此端口
      carport_known_act_addKnown: 'staticBase/json/carportKnown.json',//[添加/删除熟车] 
      //车源列表
      carport_source_get: 'staticBase/json/carportKnown.json', // [获取数据]
      carport_source_act_addKnown: 'staticBase/json/carportKnown.json', // [添加/删除熟车] 车源联系也用此端口

      carport_post_addcontact : 'staticBase/json/find.json',//[添加联系]
      //车源联系列表
      carport_contact_get: 'staticBase/json/carportKnown.json', // [获取数据]

      //用户
      user_get: 'staticBase/json/userSettingN.json',  // [获取数据]
      user_comment_self: 'staticBase/json/userSettingN.json',  //[编辑用户资料]
      user_checkMobile : 'staticBase/json/userSettingN.json',  //验证用户手机
      user_checkBusinessMobile : 'staticBase/json/userSettingN.json',  //验证用户手机

      user_create_driver: 'staticBase/json/userSettingN.json', // [认证司机]  创建
      user_edit_driver: 'staticBase/json/userSettingN.json', // [认证司机] 修改
      user_view_driver: 'staticBase/json/userSettingN.json', // [认证司机] 查看
      
      user_edit_car: 'staticBase/json/userSettingN.json', //  车辆信息 修改

      user_create_sender: 'staticBase/json/userSettingN.json', // [认证货主] 创建
      user_edit_sender: 'staticBase/json/userSettingN.json', // [认证货主] 修改
      user_view_sender: 'staticBase/json/userSettingN.json', // [认证货主] 查看

      user_create_factory: 'staticBase/json/userSettingN.json', // [认证货主] 创建
      user_edit_factory: 'staticBase/json/userSettingN.json', // [认证货主] 修改
      user_view_factory: 'staticBase/json/userSettingN.json', // [认证货主] 查看

      user_post_address: 'staticBase/json/userSettingN.json' // [发送位置]

      //业务员
      ,business_r_get: 'staticBase/json/business.json' // [业务员 推荐记录]
  };
  /* 服务器数据接口*/
  var server_url= {
      basicUrl : basicUrl,
      index : basicUrl + '/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=wuliu.index',
      //login
      login : basicUI+'&r=account.login&backurl=aT0yJmM9ZW50cnkmbT1ld2VpX3Nob3B2MiZkbz1tb2JpbGUmcj13dWxpdS5pbmRleA',// [登录页面]
      logout : basicUI+'&r=account.index.logout',  //退出


      //查看货源
      findgoods_get : basicUI+"&r=wuliu.find&operation_type=findGoods",// [获取数据]
      findgoods_post_browseCount : basicUI+"&r=wuliu.find&operation_type=browseCount", //[发送点击数据]
      findgoods_post_addcontact : basicUI+"&r=wuliu.find&operation_type=addContact", //[添加联系记录] !!!

      //联系货源
      findgoodsContact_get : basicUI+'&r=wuliu.find&operation_type=ContactList', //[联系货源获取数据] !!!

      //发布货源
      sendgoods_post : basicUI+"&r=wuliu.send&operation_type=sendGoods",// 发布货源[添加数据]
      sendgoods_get : basicUI+"&r=wuliu.send&operation_type=GetSendGoods",// 发布货源[获取数据]
      //发布记录
      sendgoods_r_get : basicUI+"&r=wuliu.send&operation_type=GetSendGoodsR", //[获取数据]
      sendgoods_r_act : basicUI+"&r=wuliu.send&operation_type=sendGoodsR_Operate",//[数据操作]

      //常发货源
      sendgoods_u_get : basicUI+"&r=wuliu.send&operation_type=GetSendGoodsU", //[获取数据]
      sendgoods_u_act : basicUI+"&r=wuliu.send",//[数据操作]
      sendgoods_u_act_delete : basicUI+"&r=wuliu.send&operation_type=Often_Delete",//[数据操作][删除]

      //车源
      //
      //手动添加熟车
      carport_addKnown: basicUI+"&r=wuliu.carport&operation_type=carport_Add", // 手动熟车


      //熟车列表
      carport_known_get : basicUI+"&r=wuliu.carport&operation_type=GetCarportKnown", //[获取数据]
      carport_known_act_comment: basicUI+"&r=wuliu.carport&operation_type=AddComment", //[操作备注] 所有车源列表 操作备注都用此端口
      carport_known_act_addKnown: basicUI+"&r=wuliu.carport&operation_type=CarportDelete",//[添加/删除熟车]

      //车源列表
      carport_source_get: basicUI+"&r=wuliu.carport&operation_type=GetCarportSource",  //[获取数据]
      carport_source_act_addKnown: basicUI+"&r=wuliu.carport&operation_type=Known_Operate", //[添加/删除熟车]

      carport_post_addcontact : basicUI+"&r=wuliu.carport&operation_type=addContact", //[添加联系记录]!!!
      //车源联系列表
      carport_contact_get: basicUI+'&r=wuliu.carport&operation_type=ContactList', // [获取数据] !!!


      //用户
      user_get: basicUI+"&r=wuliu.user&operation_type=GetUserSetting",  //[获取数据]
      user_comment_self: basicUI+"&r=wuliu.user&operation_type=AmendUser",  //[编辑用户中心资料]
      user_checkMobile : basicUI+'&r=wuliu.user&operation_type=checkMobile',  //验证用户手机
      user_checkBusinessMobile : basicUI+'&r=wuliu.user&operation_type=checkBusinessMobile',  //验证用户手机
      //发送用户信息
      user_post_address: basicUI+'&r=wuliu.user&operation_type=position', // [发送位置]

      //司机
      user_create_driver: basicUI+"&r=wuliu.user&operation_type=createDriver", // [认证司机]  创建
      user_edit_driver: basicUI+"&r=wuliu.user&operation_type=editDriver", // [认证司机] 修改
      user_view_driver: 'staticBase/json/userSettingN.json', // [认证司机] 查看

      user_edit_car: basicUI+"&r=wuliu.user&operation_type=userCommentDriver", //  车辆信息 修改

      //货主
      user_create_sender: basicUI+"&r=wuliu.user&operation_type=createShipper", // [认证货主] 创建
      user_edit_sender:   basicUI+"&r=wuliu.user&operation_type=editShipper", // [认证货主] 修改
      user_view_sender: 'staticBase/json/userSettingN.json', // [认证货主] 查看

      user_create_factory: 'staticBase/json/userSettingN.json', // [认证厂家] 创建
      user_edit_factory: 'staticBase/json/userSettingN.json', // [认证厂家] 修改
      user_view_factory: 'staticBase/json/userSettingN.json', // [认证厂家] 查看

      business_r_get: basicUI + "&r=wuliu.Business&operation_type=GetBusinessList" // [业务员 推荐记录]
  };

	//js文件引用基础路径
  var commonUrl = basicUrl + '/staticBase/js';
  var libUrl = basicUrl + '/staticBase/js/lib';
  var options = {
    base: basicUrl,
    charset: 'utf-8',
    //map: [[/^(.*\.(?:css|js))(.*)$/i, t]],  //map,批量更新时间戳
    //路径别名
    paths: {
      'basicUrl' : basicUrl,
      'commonUrl' : commonUrl,
      'city' : commonUrl + '/city',
      'dialog'  : commonUrl + '/dialog',
      'plug' : commonUrl + '/plug',
      'tpl'  : commonUrl + '/tpl',
      'component' : commonUrl + '/component',
      'pages' : commonUrl + '/pages',
      'utils' : commonUrl + '/utils'
    },
    //文件别名
    alias: {
      // 引用公共库文件
      'commonBase' : commonUrl+'/commonBase',
      'siteHash' : commonUrl + '/city/siteHash.js',
      'site' : commonUrl + '/city/site.js',
      'demoCity' : commonUrl + '/city/demo_city.js',
      'positionHash' : commonUrl + '/city/positionHash.js',

      'ksmap': commonUrl + '/utils/ksmap/ks_map.js',
      'ksvalidata': commonUrl + '/utils/ksvalidate/ks_validate.js',
      'ksvalidata_regs': commonUrl + '/utils/ksvalidate/ks_validate_regs.js',

      'fhIssue_new': basicUrl + '/staticConsignorSendMS/js/fhIssue_new'
    }
  };
  var t = '$1?v=' + (new Date).getTime();

  if(window._G_.mode.status != window._G_.mode.server){ //因使用html合并, 失效
    options.map = [[/^(.*\.(?:css|js))(.*)$/i, t]];
    options.alias.vue = libUrl + '/vue/vue-2.2.0.js';
  };
  if(window._G_.mode.status != window._G_.mode.debug ){
    window._G_.url= server_url;
  };
	seajs.config(options)
})

seajs.use("base");
