define(function(require,exports,module) {
  "use strict";
  var _ks = require('utils/ks_utils.js');

  var _common = {
  /* 1.数据初始化 S */
    getUserInfo: function(opts,callback){
      var _this = this,
          user = {},
          sum = 2,
          num = 0,
          defalts = {};
      user.id = opts.userId;
      opts = _ks.extend({},defalts,opts);
      var userData = _this.getUserData(opts, function(data){
        num++;
        if(user.id && (user.id.toString() !== data.userId.toString())){
          console.warn("ID异常");
        };
        user.id = data.userId || user.id;//重复读取用户ID
        user.data = data;
        if( num>=sum ){
          user = _common.formatUserInfo(user);
          _ks.run(callback,user);
        };
      });
      var userPos = _this.getUserPos(opts,function(pos){
        num++;
        user.pos = pos;
        if( num>=sum ){
          user = _common.formatUserInfo(user);
          _ks.run(callback,user);
        };
      });
    },
    getUserData : function(opts,callback){
      var _this = this;
      var defaults ={
        type: "GET",
        async: true,
        //ks_change_ajaxUrl
        url: window._G_.url.user_get,
        data: {
          'userId' : opts.userId,
          't' : new Date().getTime()
        },
        dataType: "json",
        success : function(userData){
          userData = _this.digestData(userData);
          // setTimeout(function(){ /* 模拟延迟  */
          if(userData.status === "OK"){
            userData = _this.formatUserData(userData.content);
            _ks.run(callback,userData);
          }else{
            toLogin();
          }
          // },3000)
        },
        error : function(res){
          toLogin();
        },
        complete : function(res){}
      };
      function toLogin(){
        // $.alert("请重新登录",function(){
          var login = _G_.url.login;
          var auditType = _ks.getUrlParam("auditType");
          if(auditType){
              login += /\?/.test(index) ? '&' : '?';
              login += "auditType="+auditType;
          }
          window.location.href= login;
        // });
      };
      var data = $.extend({}, defaults.data, opts.data),
          ajaxOpts = $.extend({}, defaults, opts.ajax);
          ajaxOpts.data = data;
      return $.ajax(ajaxOpts)
    },
    getUserPos : function(opts,callback){
      //KsMap.fn
      KsMap.fn.getUserCityHash(function(userPose){
        _ks.run(callback, userPose)
      })
    },
    postUserInfo : function(user){
      if(!(user.isDriver && user.isAudited)) {
        //console.warn("用户类型不是认证司机,无需追踪位置, data: ", user.data)
        return
      };
      $.ajax({
        //TOFIX
        url : window._G_.url.user_post_address,
        type : "get",
        dataType: "json",
        data : {
          id : user.id,
          cityName : user.pos.cityName,
          cityCode : user.pos.cityCode,
          lng : user.pos.point.lng,
          lat : user.pos.point.lat,
          action : 'postUserPosition'
        }
      });
    },
    digestData : function(data){
      return data;
    },
    formatUserData : function (data){
      var imageArr = ['avatar','driverLicence','drivingLicence','idAuth','store','businessLicense'];
      var url, name;
      //url响应
      for(var i =0; i<imageArr.length;i++){
        name = imageArr[i];
        url = name+'Url';
        data[name] = data[name]  || '';
        data[url] = data[url]  || '';
      }
      return data;
    },

    formatUserInfo : function (user){
      user.auditType = user.data.auditType;
      user.auditStatus = user.data.auditStatus;
      user = _common.getAuditeStatus(user);
      return user;
    },

    formatList : function(listData,opts){
      if(!listData.length) return [];
      if(window._G_.mode.status != window._G_.mode.server){
        while(listData.length<3){
          listData = listData.concat(listData);
        }
      }
      opts = opts || {};
      var _vm = this;
      listData.forEach( function(listF, index) {
        _common.formatListF(listF,opts);
      });
      return listData;
    },

    formatListF : function(listF,opts){
      var registerTimeDiff, createTimeDiff, createTimeDiffShort;

      if('undefined' !== typeof listF.registerTime){
        registerTimeDiff = _ks.date.timeDiff(listF.registerTime);
        if(/恒丰物流/.test(registerTimeDiff)){
          registerTimeDiff = '';
        }else if (/刚刚/.test(registerTimeDiff)){
          registerTimeDiff = '刚刚注册';
        }else if(registerTimeDiff){
          registerTimeDiff = "已注册"+registerTimeDiff;
        }
        listF.registerTimeDiff = registerTimeDiff;
      };

      if('undefined' !== typeof listF.createTime){
        createTimeDiff = _ks.date.stringifyFriendly(listF.createTime);
        listF.createTimeDiff = createTimeDiff;
        listF.createTimeDiffShort = createTimeDiff.substr(-5);
      };

      //for sendGoodsR 等..
      listF.checked = false;

      if('carport' === opts.formatType){
        _common.formatListFCarport(listF,opts);
      };

      //carpotKnown 等特殊列表 无Id值得情况
      if(!listF.id){
        if(window._G_.mode.status != window._G_.mode.server) console.warn("注意: 此列表无id值, 为自动补全")
        listF.id = listF.collectId || listF.carId || listF.userId;
        if(!listF.id && (window._G_.mode.status != window._G_.mode.server)){
          console.error('列表缺少Id值,会引发某些错误')
        }
      }
    },
    formatListFCarport : function(listF,opts){
      var distance;
      if(listF.lng && listF.lat){
        distance = '距离' + ksmap.getDistance(opts.pos.point, {lng:listF.lng, lat:listF.lat});
      }else{
        distance = '未知距离';
      }
      listF.distance = distance;
      listF.lastLocateTimeDiff = _ks.date.stringifyFriendly(listF.lastLocateTime);
      listF.lastAddressDiff = ksmap.getCityAddressByCode(ksmap.getCityCodeByAddress(listF.lastAddress)) || '未知位置';
    },
  /* 1.数据初始化 E */
  /* 2.ajax数据接口 S */
    initDataVm : function(opts){
      opts = opts || {};
      var data = opts.data || {};
      var _vm = this;

      _vm.hasData = true;
      _vm.hasMore = true;
      _vm.isLoading = true;
      _vm.isShowLoading = true;
      _vm.loadingText = "正在加载中";
      _vm.listDataF = [];
      _vm.minId = '';
      _vm.page = 1;
      var _opts = {
        type: "GET",
        async: true,
        dataType: "json",
        url: _vm.initUrl,
        data: {
          'userId' : _vm.user.id,
          'page' : _vm.page,
          'pageSize' : _vm.pageSize,
          't' : new Date().getTime()
        },
        success : function(res){
          //setTimeout(function(){ //模拟延迟
          res = _common.digestData(res);
          var listData = res.content && res.content.messages || []; //listData=[];
          if(res.status ==="NO"){
            _vm = initErrorOrEmpty(_vm,res);
          }else if(!listData.length){
            _vm = initErrorOrEmpty(_vm,res);
            //_vm.loadingIcon = false;
          } else if(res.status ==="OK"){
            _vm.hasData = true;
            _vm.hasMore = true;
            _vm.listDataF =  _common.formatList(listData, opts);
            _vm.minId = res.minId;
            _vm.page++;
            _vm.isShowLoading = false
          }
          //},500000)
        },
        error : function(res){
          _vm = initErrorOrEmpty(_vm,res);
        },
        complete : function(res){
          _vm.isLoading = false;
        }
      };
      _opts.data = _ks.extend({},_opts.data,data);
      return $.ajax(_opts);

      function initErrorOrEmpty(_vm,res){
        _vm.hasData = false;
        _vm.hasMore = false;
        _vm.isShowLoading = true;
        _vm.loadingText = '无匹配数据';
        if(!res.errorMsg || res.status ==="OK") return _vm;
        $.alert(res.errorMsg ,function(){
            _vm.loadingText = res.errorMsg;
        });
         return _vm;
      }
    },

    loadMoreDataVm : function(opts){
      var _vm = this;
      opts = opts || {};
      var data = opts.data || {};
      _vm.isLoadingMore = true;
      var _opts = {
        type: "GET",
        async: true,
        dataType: "json",
        url: _vm.loadMoreUrl,
        data: {
          'userId' : _vm.user.id,
          'page' : _vm.page,
          'pageSize' : _vm.pageSize,
          'minId' : _vm.minId,
          't' : new Date().getTime()
        },
        success : function(res){
          res = _common.digestData(res);
          var listData = res.content && res.content.messages || [];

          if(res.status==="NO"){
            _vm.hasMore = false;
            console.error("服务端状态错误");
          }else if(!listData.length){
            _vm.hasMore = false;
          } else {
            _vm.hasMore = true;
            listData =  _common.formatList(listData, opts);
            _vm.listDataF = _vm.listDataF.concat(listData);
            _vm.page++;
          }
        },
        error : function(res){
          _vm.hasMore = false;
        },
        complete : function(res){
          _vm.isLoadingMore = false;
        }
      };
      _opts.data = _ks.extend({},_opts.data,data);
      return $.ajax(_opts);
    }
  /* ajax数据接口 E */
  /* dom及属性操作 S */

  /* dom及属性操作 E */
  /* 其它数据初始化 S */
    ,getAuditeStatus :function(listF){
      var status = '',type = '';

      listF.isAudited = false;
      switch(Number(listF.auditStatus)){
        case window._G_.auditSuccess:
          listF.isAudited = true;
          status = '已认证';
          break;
        case window._G_.auditError:
          status = '认证失败';
          break;
        case window._G_.auditNotyet:
          status = '未认证';
          break;
        case window._G_.auditIng:
          status = '认证中';
          break;
      }

      switch(Number(listF.auditType)){
        case window._G_.noType:
          type = '游客';
          status = "未认证";
          listF.isVisitor = true;
          break;
        case window._G_.driver:
          type = '司机';
          listF.isDriver = true;
          break;
        case window._G_.sender:
          type = '货主';
          listF.isSender = true;
          break;
        case window._G_.business:
          type = '业务员';
          listF.isBusiness = true;
          break;
        case window._G_.factory:
          type = '厂家';
          listF.isFactory = true;
          break;
      }
      listF.auditTypeName = type
      listF.auditStatusName = status;
      return listF;
    }
  /* 其它数据初始化 E */
  };
  return _common
})
