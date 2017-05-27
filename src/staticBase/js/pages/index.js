define(function(require, exports, module) {
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
  window._fhIssue = require('fhIssue_new');//必须先在index这里引入 fhIssue, 然后 sendgoods 里才能引入成功,site文件较大/异步加载的关系?;
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
    var vm = new main().$mount('#index');


    //router.afterEach(function (to, from) {  vm.isLoading = false; }); //对应 vm.$data.isLoading = false 事件写入 storeSync 中
    //vuex-router-sync
    /*
    function storeSync (store, router, options) {
      var moduleName = (options || {}).moduleName || 'route'

      store.registerModule(moduleName, {
        state: cloneRoute(router.currentRoute),
        mutations: {
          'router/ROUTE_CHANGED': function (state, transition) {
            store.state[moduleName] = cloneRoute(transition.to, transition.from)
          }
        }
      })

      var isTimeTraveling = false
      var currentPath

      // sync router on store change
      store.watch(
        function (state) { return state[moduleName] },
        function (route) {
          if (route.fullPath === currentPath) {
            return
          }
          isTimeTraveling = true
          currentPath = route.fullPath
          router.push(route)
        },
        { sync: true }
      )

      // sync store on router navigation
      router.afterEach(function (to, from) {
        if (isTimeTraveling) {
          isTimeTraveling = false
          return
        }
        currentPath = to.fullPath
        store.commit('router/ROUTE_CHANGED', { to: to, from: from })
      })
    }

    function cloneRoute (to, from) {
      var clone = {
        name: to.name,
        path: to.path,
        hash: to.hash,
        query: to.query,
        params: to.params,
        fullPath: to.fullPath,
        meta: to.meta
      }
      if (from) {
        clone.from = cloneRoute(from)
      }
      return Object.freeze(clone)
    }
    */
    
  });

});

