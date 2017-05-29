"use strict";
  // Vue.use(VueLazyload, {
  //   preLoad: 1.3,
  //   error: window._G_.url.basicUrl+'/staticBase/img/avatar.jpg',
  //   loading: window._G_.url.basicUrl+'/staticBase/img/loadavatar.svg',
  //   attempt: 2
  // })

  window._base  = require('utils/ks_base.js');
  window._ks = _base.utils;
  window._common = _base.common;
  window._dom = _base.dom;
  window.KsValidate = _base.validate;
  window.valiOpts = _base.valiOpts;
  window.KsMap = _base.map;
  window.Picker = _base.picker;
  //window._fhIssue = require('fhIssue_new');//必须先在index这里引入 fhIssue, 然后 sendgoods 里才能引入成功,site文件较大/异步加载的关系?;
  /* 全局替换 KsValidate S */
  var KsValidateReplace = {
        showSuccess : function(data){
          //$.toptip("添加熟车成功", 2000, 'success'); 
        },
        showWarn : function(data){
          $.toptip(data.message, 2000, 'warn'); 
        },
        showError : function(data){
          $.toast(data.message, 'forbidden'); 
        }
      };
  _ks.extend(KsValidate.fn ,KsValidateReplace );
  /* 全局替换 KsValidate E */
  
  $.toast.prototype.defaults.duration = 1000;
  /* 全局替换 E*/

  var component = require('component/component.js');

  for( var key in component ){
    if(component[key] && component.hasOwnProperty(key)){
      Vue.component(key, component[key]);
    }
  };
  
  var router = require('commonUrl/router/router-sync.js'),
      store = require('commonUrl/store/index.js');

  window._base && component && router && store || window.location.reload(false);
  window.__LOADED = true;
  //vuex-router-sync
  // store.state.route.path   // current path (string)
  // store.state.route.params // current params (object)
  // store.state.route.query  // current query (object)
  _common.getUserInfo({},function(user){
      router.beforeEach(function(to, from, next){ 
      //非生产模式则不考虑权限过滤, 方便调试;
      if(window._G_.mode.status != window._G_.mode.server){
        next();
        return;
      }
      var driverArr=['/findGoodsContact','/userCommentCar'],
          senderArr=['/sendGoods','/sendGoodsR','/sendGoodsU','/sendGoodsL','/carportContact','/carportAdd','/carportKnown'],
          businessArr=['/businessR'];
      if(_ks.inArray(to.path, driverArr) && !(user.isAudited && user.isDriver)){
        $.alert("成功认证后可使用此项功能")
      }else if(_ks.inArray(to.path, senderArr) && !(user.isAudited && (user.isSender || user.isFactory))){
        $.alert("成功认证后可使用此项功能")
      }else if(_ks.inArray(to.path, businessArr) && !(user.isAudited && user.isBusiness)){
        $.alert("非法访问!");
      }else{
        //vm.isLoading = true; //异步路由下才能使用, 此时vm实例才初始化;
        next();
      }
    });
    //storeSync(store, router);
    var _main = {
      router : router,
      store : store,
      data: function(){
        return {
          'loadingText' : '数据加载中',
          'loadingIcon' : true,
          'user' : user,
          'transitionName' : 'in-out-translate',//'out-in',
          'isLoading': false,
        }
      },
      computed: {
      },
      mounted : function(){
        var _vm = this;
        window.ksmap = window.ksmap || KsMap();
        _vm.initUser(function(){
          _vm.initData();
          _vm.initEvent();
        });
      },
      methods : {
        initUser: function(callback){
          var _vm = this;
          _ks.run(callback);
        },
        resetUser : function(callback){
          var _vm = this;
          _common.getUserInfo({},function(user){
            _vm.user = user;
            _ks.run(callback);
          })
        },
        initData : function(){
        },
        initEvent : function(){
          this.initPostUserInfo();
          this.initFastClick();
        },
        initFastClick : function(){
          $(function() {
            FastClick.attach(document.body);
          });
        },
        initPostUserInfo(){
          _common.postUserInfo(user);//发送用户位置
          setInterval(function(){
            _common.postUserInfo(user);//发送用户位置
          },6e5)
        }

      }
    };
    
    var main = Vue.extend(_main);
    new main().$mount('#index');
  });
