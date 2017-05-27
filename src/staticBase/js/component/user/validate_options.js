/** 作者 空山, 112093112 **/
define( function(require, exports, module) {
  "use strict";
  var options = {
    inputs : {
    /* inputs S */
      /* car-add S */
        'name' : {
          name : 'name', //表单项 name
          rules : [  //验证规则数组
            {
              reg : 'realName', 
              message : '请填写正确的姓名',
              type : 2 
            }
          ]
        },
        'userName' : {
          name : 'userName', //表单项 name
          rules : [  //验证规则数组
            {
              reg : 'require', 
              message : '请填写您的昵称',
              type : 2 
            }
          ]
        },
        'mobile' : {
          name : 'mobile',
          rules : [
            {
              reg : 'mobile',
              message : '请输入正确的电话号码',
              type : 2
            }
          ]
        },
        'userMobile' : {
          name : 'userMobile',
          rules : [
            {
              reg : 'mobile',
              message : '请输入正确的电话号码',
              type : 2
            },
            {
              url : window._G_.url.user_checkMobile,  //验证接口
              reg : function(data,callback){
                var rule = data.rule,
                    value = data.value;
                var opts ={
                  type: "GET",
                  async: true,
                  url: rule.url,
                  data: {
                    'operation_type' : 'checkMobile',
                    'mobile' : value,
                    't' : new Date().getTime()
                  },
                  dataType: "json",
                  success : function(res){
                    if(res.status === "OK"){
                      callback(true);
                    }else{
                      callback(false);
                    }
                  },
                  error : function(res){
                    callback(false);
                  }
                };
                return $.ajax(opts);
              },
              async : true,  //声明异步
              message : '该电话号码已被绑定其它账户',
              type : 2
            }
          ]
        },
      /* car-add E */
      /* create-sender S */
        'realName' : {
          rules : [  //验证规则数组
            {
              reg : 'realName', 
              message : '请填写正确的姓名',
              type : 2 
            }
          ]
        },
        'idCard': {
          rules : [
            {
              reg : 'idCard',
              message : '请输入正确的身份证号码',
              type : 2
            }
          ]
        },
        'company': {
          rules : [
            {
              reg : 'require',
              message : '请输入公司名称',
              type : 2
            }
          ]
        },
        'idAuth': {
          rules : [
            {
              reg : 'require',
              message : '请上传身份认证照片',
              type : 2
            }
          ]
        },
        'store': {
          rules : [
            {
              reg : 'require',
              message : '请上传门店照',
              type : 2
            }
          ]
        },
        'businessLicense': {
          rules : [
            {
              reg : 'require',
              message : '请上传营业执照',
              type : 2
            }
          ]
        },
      /* create-sender E */
      /* create-driver S */
        'plateType': {
          rules : [
            {
              reg : 'require',
              message : '请选择车牌类型',
              type : 2
            }
          ]
        },
        'plateNumber': {
          rules : [
            {
              reg : 'require',
              message : '请输入车牌号码',
              type : 2
            }
          ]
        },
        'carType': {
          rules : [
            {
              reg : 'require',
              message : '请选择车辆类型',
              type : 2
            }
          ]
        },
        'carLen': {
          rules : [
            {
              reg : 'require',
              message : '请选择车长',
              type : 2
            }
          ]
        },
        'loadNum': {
          rules : [
            {
              reg : 'require',
              message : '请输入载重',
              type : 2
            },
            {
              reg : 'maxNum',
              message : '载重最大不能超过100',
              param : '100',
              type : 2
            },
          ]
        },
        'driverLicence': {
          rules : [
            {
              reg : 'require',
              message : '请上传驾驶证',
              type : 2
            }
          ]
        },
        'drivingLicence': {
          rules : [
            {
              reg : 'require',
              message : '请上传行驶证',
              type : 2
            }
          ]
        }

        /* inputs E */
      /* create-driver E */
    /* inputs E */
    }
  };
  return options;
})
