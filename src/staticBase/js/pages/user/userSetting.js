define(function(require, exports, module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common;

  var template = `
<div class="wrap transition-wrap">
  <div class="header_box">
    <header-back 
      title = "用户设置" 
      right-text="退出"
      @right-event="logout"
    ></header-back>
  </div>
  <div class="content_box" id="usersetting-pull-to-refresh-wrap">

    <pull-to-refresh
      wrap-id = 'usersetting-pull-to-refresh-wrap'
      @refresh = 'reload'
    ></pull-to-refresh>
    <!-- 用户信息头部 S-->
    <user-detail-head 
      v-bind:user="user" 
      v-on:audite= 'audite'
    >
    </user-detail-head>
    <div class="weui-btn-area">
      <a class="weui-btn weui-btn_primary orange_btn" href="javascript:;" @click="audite" v-text="auditeButtonText" v-if="!user.isBusiness">申请认证</a>
      <router-link to="/userCommentCar" v-if="user.isDriver" class="weui-btn weui-btn_primary orange_btn" >发布车辆</router-link>
      <router-link to="/businessR" v-if="user.isBusiness" class="weui-btn weui-btn_primary orange_btn" >我的推荐</router-link>
      <router-link to="/userCommentSelf" class="weui-btn weui-btn_primary orange_btn">联系资料</router-link>
    </div>
  </div>
</div>
`;
  var _userSetting = {
    template : template,
    data: function(){
      return {
        'transitionName' : 'in-out-translate-fade',
        isShowCreateDriver : false,
        isShowCreateSender : false,
        detailTitle : '',
        isLoading : false,
        auditeButtonText : '申请认证',
        isShowCommentDriver : false,
        isShowCommentSender : false,
        formType : ''
      }
    },
    props : ['user'],
    mounted : function(){
      var _vm = this;
      _vm.initData(function(){
        _vm.initEvent();
      });
    },
    methods : {
      initData : function(callback){
        _ks.run(callback);
      },
      reload : function(){
        window.location.reload(false);
      },
      initAuditeButton : function(){

        if( this.user.isAudited){
          this.auditeButtonText = "查看认证"
        }else{
          this.auditeButtonText = "提交认证"
        };
      },
      /** 需加载事件 **/
      initEvent : function(){
        //this.showResult();
        this.initAuditeButton();
      },
      showResult : function(){
        var status = _ks.getUrlParam('status','hash'),
            message = _ks.trim(_ks.getUrlParam('message','hash'));
        if(message){
          if(status==="OK"){
            $.toast(message,'1000');  
          }else{
            $.toast(message, "cancel");
          }
        }
      },
      //事件钩子 S
      audite: function(){
        var _this = this,
            auditType = this.user.auditType;
        if(auditType == window._G_.noType){
          $.modal({
            title: "请选择认证类型",
            text: "成功认证可以获得更快更多的资讯",
            buttons: [
              { text: "司机", onClick: function(){ 
                _this.$router.push('./userAuditeDriver');
              }},
              { text: "货主", onClick: function(){ 
                _this.$router.push('./userAuditeSender');
              }}
            ]
          });
        }else if(auditType == window._G_.driver){
          this.$router.push('./userAuditeDriver');
        }else if(auditType == window._G_.sender || auditType == window._G_.factory ){
          this.$router.push('./userAuditeSender');
        }
      },
      logout : function(){
        window.location.href = window._G_.url.logout;
      }
    }
  };
  var userSetting = Vue.extend(_userSetting);
  return userSetting;
});
