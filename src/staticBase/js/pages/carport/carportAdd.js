define(function(require, exports, module) {
  "use strict";
  var _carport = require("./carport-common.js");

  var template = `
<div class="wrap transition-wrap carport-add" >

  <div class="header_box">
    <header-back title = "手动添加熟车" ></header-back>
  </div>
  <div class="content_box">
    <div class="add_contact_con mt_10 border_b_1">
      <!--表单 S-->
      <div class="weui-cells weui-cells_form">
      <form action="" ref="addCar_form">
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" autocomplete="off" maxlength="11" placeholder="请输入司机姓名" v-model="driverName" name="name" />
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">电话</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" autocomplete="off" maxlength="11" placeholder="请输入司机手机号码" v-model="driverMobile" name="mobile" />
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <textarea
              id="carport-add_comment"
              name="comment"
              class="weui-textarea" 
              placeholder="请输入备注信息" 
              rows="3"
              maxlength="60"
              v-model="driverComment"
              ></textarea>
            <div class="weui-textarea-counter">
              <span v-text="driverCommentLength"></span>/60
            </div>
          </div>
        </div>

      </form>
      </div>
      <!--表单 E-->
    </div>
    <div class="weui-btn-area">
      <a class="weui-btn weui-btn_primary orange_btn" href="javascript:" ref="addCar_submit">确定</a>
    </div>
  </div>
</div>
`
  var _carportAdd = {
    template : template,
    data: function(){
      return {
        //ks_chage_ajaxUrl
        'postUrl' : window._G_.url.carport_addKnown,

        'transitionName' : 'in-out-translate-fade',

        'ksvalidate' : '',
        driverMobile : '',
        driverName : '',
        driverComment : '',
        isPosting: false
      }
    },
    props : ['user'],
    computed:{
      driverCommentLength : function(){
        return this.driverComment.length;
      }
    },
    mounted : function(){
      var _vm = this;
      this.initData();
    },
    methods : {
      initData : function(){
        this.initEvent();
      },
      /** 需加载事件 **/
      initEvent : function(){
        this.initValidate();
      },
      initValidate : function(){
        var _vm = this;
        var _opts = {
          checkType : 'submit',
          checkAll : false,
          form : _vm.$refs.addCar_form,
          submitBtn : _vm.$refs.addCar_submit,
          extend : {
            submitPost : _vm.postCarportAdd //提交数据,拦截
          }
        };
        var opts = $.extend({},valiOpts,_opts);
        this.ksvalidate = KsValidate(opts);
      },
      resetForm : function(){
        this.driverMobile = '';
        this.driverName = '';
        this.driverComment = '';
      },
      postCarportAdd : function(listF){
        var _vm = this;
        if(_vm.isPosting) return;
        var opts = {
          url : _vm.postUrl,
          data : {
              'action' : 'addKnownHand',
              'userId' : _vm.user.id,
              'driverMobile' : _vm.driverMobile,
              'driverName' : _vm.driverName,
              'driverComment' : _vm.driverComment
          },
          msgSuccess : '添加成功',
          msgError : '网络错误,添加熟车失败'
        }
        _ks.run.call(_vm,_carport.postDataVm,opts)
        .done(function(){
          _vm.resetForm();
        });
      }
    }
  };

  var carportAdd = Vue.extend(_carportAdd);
  return carportAdd;

});
