define(function(require, exports, module) {
"use strict";
var template = `
  <div class="footer-batch"  v-show = "isShow">
    <div class="weui-cells weui-cells_checkbox clearfix">
      <div class="fl">
        <label class="weui-cell weui-check__label">
          <div class="weui-cell__hd">
            <input 
              type="checkbox" 
              class="weui-check" 
              @click = "selectAll"
              :checked = "checkedAll"
            >
            <i class="weui-icon-checked orange_checked"></i>
          </div>
          <div class="weui-cell__bd c_o">
            <p>全选</p>
          </div>
        </label>
      </div>
      <div class="footer-batch_btns fr c_o">
        <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary orange_btn detail_btn fr"
          v-show="listDataType == 'sending'"
          @click="actionAll('close')"
        >关闭</a>
        <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary orange_btn detail_btn fr"
          @click="actionAll('delete')"
        >删除</a>
        <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary orange_btn detail_btn fr"
          v-show="listDataType == 'sending' || listDataType == 'closing'"
          @click="actionAll('refresh')"
        >重发</a>
      </div> 
    </div>
  </div>
` ;

  var footerBatch = {
    template : template,
    data: function(){
      return {}
    },
    props : ['isShow','checkedAll','listDataType'],
    methods : {
      selectAll : function(){
        this.$emit('select-all');
      },
      actionAll : function(actionType){
        this.$emit('action-all',actionType);
      }
    }
  };
  footerBatch = Vue.extend(footerBatch);
  return footerBatch;

});
