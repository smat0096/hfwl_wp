define(function(require, exports, module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _send = require("./send-common.js");
      
  var template = `
<div class="wrap  transition-wrap publish_goods publish_goods_u" id="send_goods_u">

  <header-back 
    title = "常发货源" 
    v-bind:right-text = "isMultipleText" 
    v-on:right-event = "changeSelectMode"
  ></header-back>

  <div class="content_box"  style="top:50px; bottom: 50px" id="loadmore-wrap-sendgoods-u">
  
    <pull-to-refresh
      wrap-id = 'loadmore-wrap-sendgoods-u'
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
          <transition-group name="flip-list" tag="div">
          <div v-for="listF in listDataF"  :key="listF.id">
            <sendgoods-list
              v-bind:list-f = "listF" 
              v-bind:list-data-type = "listDataType"
              v-bind:is-multiple = "isMultiple"
              v-on:select-one="selectOne"
              v-on:action-data="doActionData"
            >
              <div slot="footer-right">
                <div class="fr c_o">
                  <a href="javascript:;" 
                    class="weui-btn weui-btn_mini orange_btn_plain detail_btn"
                    @click="deleteOne(listF)"
                  >删除</a>
                  <a href="javascript:;"
                    class="weui-btn weui-btn_mini orange_btn_plain detail_btn"
                    @click="resend(listF)"
                  >再次发布</a>
                </div>
              </div>
            </sendgoods-list>
          </div>
          </transition-group>
        <!-- content_box_list E-->
      </form>
      <loadmore-scroll 
        v-on:load-more-data="loadMoreData"
        v-bind:has-more = "hasMore"
        v-bind:wrap-id = "'loadmore-wrap-sendgoods-u'"
        v-bind:is-loading-more = "isLoadingMore"
      >
      </loadmore-scroll>
    </div>
  </div>

  <footer-batch
    :is-show = "isMultiple"
    :checked-all = "checkedAll"
    :list-data-type = "listDataType"
    @select-all = "selectAll"
    @action-all = "actionAll"
  ></footer-batch>

</div>
` ;

  var _sendgoodsU = {
    template : template,
    data: function(){
      return {
        'page' : 1,
        'minId' : '',
        
        //ks_change_ajaxUrl
        'initUrl' : window._G_.url.sendgoods_u_get,
        'loadMoreUrl' : window._G_.url.sendgoods_u_get,
        'actionUrl' : window._G_.url.sendgoods_u_act,
        
        'transitionName' : 'in-out-translate-fade',
        
        'isLoading': false,
        'isShowLoading': false,
        'hasData' : true,
        'loadingText' : '数据加载中',
        'loadingIcon' : true,
        'isLoadingMore': false,
        'hasMore' : true,

        'listDataF' : [],
        'listDataType' : 'usually',
        'checkedAll' : false,
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
      changeSelectMode : function(){
        _send.changeSelectMode.call(this);
      },
      selectAll : function(){
        _send.selectAll.call(this);
      },
      selectOne : function(listF){
        _send.selectOne.call(this,listF);
      },
      actionAll : function(action){
        var opts = {},operation_type;
        opts.action = action;
        switch(action){
          case 'delete' : opts.operation_type = 'Often_Delete'; break;
          // case 'refresh': operation_type = '';break;
          // case 'close'  : operation_type = ''; break;
        }
        _send.actionAll.call(this,opts);
      },
      deleteOne : function(listF){
        listF.checked = true;
        var opts = {
          id : [listF.id],
          action : 'delete',
          operation_type : 'Often_Delete'
        };
        _send.doActionData.call(this,opts);
      },
      resend : function(listF){
        //window.location.href = 'http://localhost:3000/index.htm#/sendGoodsP?messageId='+listF.id;
        var path = './sendGoodsP' + '?messageId='+listF.id;
        this.$router.push(path);
      }
      /** send_common E **/

    }
  };

  var sendgoodsU = Vue.extend(_sendgoodsU);
  //var vm = new sendgoodsU().$mount('#send_goods_u');
  return sendgoodsU;

});
