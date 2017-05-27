define(function(require, exports, module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _send = require("./send-common.js");

  var template = `
<div class="wrap  transition-wrap publish_goods publish_goods_l">

  <header-back title = "运单" ></header-back>

  <div class="content_box"  style="top:50px; bottom: 10px">
    <div class="weui-tab">

      <div class="weui-navbar">
        <a 
          class="weui-navbar__item weui-navbar__orange"
          :class="{ 'weui-bar__item--on' : listDataType == 'salaryLoading'}"
          href="javascript:;"
          @click = "getTypedData('salaryLoading')"
          >
          待装货
        </a>
        <a 
          class="weui-navbar__item weui-navbar__orange" 
          :class="{ 'weui-bar__item--on' : listDataType == 'salaryLoaded'}"
          href="javascript:;"
          @click = "getTypedData('salaryLoaded')"
          >
          已装货
        </a>
        <a 
          class="weui-navbar__item weui-navbar__orange" 
          :class="{ 'weui-bar__item--on' : listDataType == 'salaryRefund'}"
          href="javascript:;"
          @click = "getTypedData('salaryRefund')"
          >
          已退款
        </a>
        <a 
          class="weui-navbar__item weui-navbar__orange" 
          :class="{ 'weui-bar__item--on' : listDataType == 'salaryGetPay'}"
          href="javascript:;"
          @click = "getTypedData('salaryGetPay')"
          >
          投诉单
        </a>
      </div>

      <div class="weui-tab__bd">
        <div class="weui-tab__bd-item weui-tab__bd-item--active"  id="loadmore-wrap-sendgoods-l"  style="width:100%">
            
          <pull-to-refresh
            wrap-id = 'loadmore-wrap-sendgoods-l'
            @refresh = 'initData'
          ></pull-to-refresh>
          
          <loading-page 
            v-show="isShowLoading"
            :loading-icon='loadingIcon'
            :loading-text="loadingText"
          ></loading-page>

          <div class="weui-panel weui-panel_access publish_goods_r_listsbox" >
            
            <form id="published_goods">
              <!-- content_box_list S-->
              <div v-for="listF in listDataF">
                <sendgoods-list 
                  v-bind:list-f = "listF" 
                  v-bind:list-data-type = "listDataType"
                  v-on:select-one="selectOne"
                  v-on:action-data="doActionData"
                ></sendgoods-list>
              </div>
              <!-- content_box_list E-->
            </form>

            <loadmore-scroll 
              v-on:load-more-data="loadMoreData"
              v-bind:has-more = "hasMore"
              v-bind:wrap-id = "'loadmore-wrap-sendgoods-l'"
              v-bind:is-loading-more = "isLoadingMore"
            >
            </loadmore-scroll>
          
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
`
  var _sendgoodsL = {
      template : template,
      data: function(){
        return {
        'transitionName' : 'in-out-translate-fade',
        'page' : 1,
        
        'minId' : '',
        'isLoading': false,
        'isShowLoading': false,
        'hasData' : true,
        'loadingText' : '数据加载中',
        'loadingIcon' : true,
        'isLoadingMore': false,
        'hasMore' : true,

        'isActioning' : false,
        'listDataF' : [],
        'listDataType' : 'salaryLoading',
        'initUrl' : 'staticBase/json/sendgoodsR.json',
        'loadMoreUrl' : 'staticBase/json/sendgoodsR.json',
        'actionUrl' : 'staticBase/json/sendgoodsR.json',

        'isMultiple' : false,
        'isMultipleText' : '进入多选'

      }
    },
    props : ['user'],
    mounted : function(){
      this.initData();
    },
    methods : {
      initData : function(callback){
        var _vm = this;
        if(_vm.isLoading) return;
        _vm.checkedAll = false;
        var data = {
          'listDataType' : this.listDataType,
        };
        var opts = {data : data};
        _ks.run.call(_vm, _common.initDataVm,opts).then(function(){
          _vm.clearChecked();
          _vm.initEvent();
          _ks.run(callback);
        });
      },
      getTypedData : function(type){
        if(type) this.listDataType = type;
        this.initData();
      },
      loadMoreData : function(){
        var _vm = this;
        if(_vm.isLoadingMore || _vm.isLoading || !_vm.hasMore) return
        var data = {
              'listDataType' : this.listDataType,
            };
        var opts = {data : data};
        _ks.run.call(_vm, _common.loadMoreDataVm,opts);
      },
      /** 需加载事件 **/
      initEvent : function(){
      },
      /** send_common S **/
      //执行关闭,删除,重发动作
      doActionData : function(opts){
        _send.doActionData.call(this, opts);
      },
      clearChecked : function(){
        _send.clearChecked.call(this);
      },
      selectOne : function(listF){
        _send.selectOne.call(this,listF);
      },
      /** send_common E **/
    }
  };

  var sendgoodsL = Vue.extend(_sendgoodsL);
  return sendgoodsL;

});
