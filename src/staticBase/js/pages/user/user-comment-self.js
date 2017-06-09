define(function(require,exports,module){
  var _user = require("./user-common.js");


var _template = `
<transition :name="transitionName">
<div class="wrap  transition-wrap  user-comment-driver" style="padding-bottom:50px">
  <div class="wrap">

    <div class="header_box">
      <header-back
        :title = "title"
      ></header-back>
    </div>

    <div class="content_box p_b-0">
      <div class="border_b_1">
        <!--表单 S-->
        <div class="weui-cells weui-cells_form">
        <form :action="formUrl" method="post" ref="self_form" enctype="multipart/form-data">
          <input type="hidden" name="formType" :value="formType" />

          <a class="weui-cell weui-cell_access weui-cell_image" href="javascript:;">
            <div class="weui-cell__hd"><label class="weui_label">头像</label>
            </div>
            <div class="weui-cell__bd">
            </div>
            <div class="weui-cell__hd">
              <div :class= "avatarInputClass">
                <input
                  ref="avatarInput"
                  name="avatar"
                  class="weui-uploader__input"
                  type="file"
                  accept="image/*"
                  v-if="!isWeixin"
                >
                <img
                  ref="avatarImage"
                  class="weui-uploader__file"
                  :src="listF.avatarUrl"
                />
              </div>
            </div>
          </a>

          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">用户名称</label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="text" autocomplete="off" maxlength="6" placeholder="请输入用户名称"
                v-model="listF.userName"
                name="userName"
              />
            </div>
          </div>

          <div class="weui-cell">
            <div class="weui-cell__hd">
            <label class="weui-label">
              手机号码
            </label></div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="text" maxlength="11"
                placeholder="请输入手机号码"
                v-model="listF.mobile"
                name="userMobile"
              />
            </div>
          </div>

        </form>
        </div>
        <!--表单 E-->
      </div>
      <div class="weui-btn-area mb-20">
        <a class="weui-btn weui-btn_primary orange_btn" href="javascript:;" ref="self_submit" @click=submit>确认提交</a>
      </div>
    </div>

    <div class="weui-mask_transparent" v-show="isSubmiting"></div>
    <div class="weui-toast weui-toast--text weui-toast--visible" v-show="isSubmiting"><i class="weui-icon-success-no-circle weui-icon_toast"></i><p class="weui-toast_content">数据上传中,请稍候...</p></div>

  </div>
</div>
</transition>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              'avatarInputClass' : '',

              'listF' : '',
              'title':'',
              'formType':'',
              'formUrl':window._G_.url.user_comment_self,

              'isSubmiting' : false,
              'isWeixin' : false,
              'ksvalidate' : '',
              'transitionName' : 'in-out-translate',
            }
        },
        props: ['user'],
        mounted: function(){
          this.isWeixin = isWeixin();
          this.initData();
          this.initEvent();
        },
        methods: {
          "initData": function(){
            this.listF = this.user.data;
            this.title = "个人联系资料";
            this.formType = 'editUser';
            this.formUrl = window._G_.url.user_comment_self;
          },
          'initEvent' : function(){
            this.initImage()
            if(!this.isWeixin){
              _user.initUploadEvt.call(this,'avatar');
            };
            this.initValidate();
          },
          initImage : function(){
            this.listF.avatarUrl ?  _user.uploadedImageInput.call(this,'avatar') : _user.resetImageInput.call(this,'avatar');
          },
          /* 使用插件默认监听提交按钮, 提交的数据为插件获取的表单值 */
          initValidate : function(){
            _user.initValidate.call(this,this.$refs.self_form,this.$refs.self_submit);
          },
          submit : function(data,callback){
            if(this.isSubmiting) return;
            var _vm = this;
            var data = {
              avatar : _vm.listF.avatar
              ,userName : _vm.listF.userName
              ,userMobile : _vm.listF.mobile
            };
            this.ksvalidate.submit(data,function(res){},data);
          }
        }
  });

  function isWeixin(){
    return /MicroMessenger/i.test(navigator.userAgent)
  }
})
