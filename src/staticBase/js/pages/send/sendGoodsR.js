define(function(require, exports, module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _send = require("./send-common.js");

  var template = `
<transition :name="transitionName" v-on:after-enter="initData">
<div class="wrap  transition-wrap publish_goods publish_goods_r">

  <header-back
    title = "发布记录"
    v-bind:right-text = "isMultipleText"
    v-on:right-event = "changeSelectMode"
  ></header-back>

  <div class="content_box"  style="top:50px; bottom: 50px">
    <div class="weui-tab">

      <div class="weui-navbar">
        <a
          class="weui-navbar__item weui-navbar__orange"
          :class="{ 'weui-bar__item--on' : listDataType === 'sending'}"
          href="javascript:;"
          @click = "getTypedData('sending')"
          >
          发布中
        </a>
        <a
          class="weui-navbar__item weui-navbar__orange"
          :class="{ 'weui-bar__item--on' : listDataType === 'closing'}"
          href="javascript:;"
          @click = "getTypedData('closing')"
          >
          已关闭
        </a>
      </div>

      <div class="weui-tab__bd">
        <div class="weui-tab__bd-item weui-tab__bd-item--active" id="loadmore-wrap-sendgoods-r" style="width:100%">

          <pull-to-refresh
            wrap-id = 'loadmore-wrap-sendgoods-r'
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
                  <div slot="header">
                    <div class="f_head" v-show="!isMultiple">
                      <div class="clearfix">
                        <div class="fl">
                          <span v-text="listF.createTimeDiff"></span>&nbsp;&nbsp;
                          <i class="icon_1 icon_1_person"></i>
                          <span v-text="listF.browseCount">50</span><span>人已浏览</span>
                        </div>
                        <div class="fr">
                          <a href="javascript:;" class="detail_price c_o hide_tmp">收信息费</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div slot="footer-right" class="fr c_o">
                    <a
                      href="javascript:;"
                      class="weui-btn weui-btn_mini orange_btn_plain detail_btn detail_btn_smaller"
                      v-if="listDataType == 'sending'"
                      @click="closeOne(listF)"
                    >关闭</a><a href="javascript:;"
                      class="weui-btn weui-btn_mini orange_btn_plain detail_btn detail_btn_smaller"
                      @click="deleteOne(listF)"
                    >删除</a><a href="javascript:;"
                      class="weui-btn weui-btn_mini orange_btn_plain detail_btn detail_btn_smaller"
                      @click="refreshOne(listF)"
                    >重发</a>
                  </div>
                </sendgoods-list>
              </div>
              </transition-group>
              <!-- content_box_list E-->

            </form>
            <loadmore-scroll
              v-on:load-more-data="loadMoreData"
              v-bind:has-more = "hasMore"
              v-bind:wrap-id = "'loadmore-wrap-sendgoods-r'"
              v-bind:is-loading-more = "isLoadingMore"
            >
            </loadmore-scroll>

          </div>
        </div>
      </div>
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
</transition>
`;
  var _sendgoodsR = {
    template : template,
    data: function(){
      return {
        'transitionName' : 'in-out-translate',
        'page' : 1,
        'minId' : '',

        //ks_chage_ajaxUrl
        'initUrl' : window._G_.url.sendgoods_r_get,
        'loadMoreUrl' : window._G_.url.sendgoods_r_get,
        'actionUrl' : window._G_.url.sendgoods_r_act,

        'isLoading': false,
        'isShowLoading': false,
        'hasData' : true,
        'loadingText' : '数据加载中',
        'loadingIcon' : true,
        'isLoadingMore': false,
        'hasMore' : true,

        'isActioning' : false,
        'listDataF' : [],
        'listDataType' : 'sending',
        'checkedAll' : false,
        'isMultiple' : false,
        'isMultipleText' : '进入多选'

      }
    },
    props : ['user'],
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
          //_vm.initbrowseCount();
          _vm.initEvent();
          _ks.run(callback);
        });
      },
      initbrowseCount : function(){
        var nowTime = (new Date).getTime();
        this.listDataF.forEach(function(listF){
          var browseCount = listF.browseCount;
          var second = (nowTime - listF.createTime)/1e3;
          if(!browseCount || browseCount <= 0){// && typeof browseCount =="object"
            if(second < 0) return;
            if(second < 60){
              browseCount = parseInt(second/6);
            }else if(second < 60*10){
              browseCount = 10 + parseInt((second-60)/10);
            }else if(second < 3600){
              browseCount = 70 + parseInt((second-600)/60);
            }else if(second < 3600*24){
              browseCount = 120 + parseInt((second-3600)/3600);
            }else if(second < 3600*24*30){
              browseCount = 150 + parseInt((second-3600*24)/3600*24);
            }else if(second < 3600*24*30*12){
              browseCount = 180 + parseInt((second-3600*24*30)/3600*24*30);
            }else{
              browseCount = 200 + parseInt((second-3600*24*30*12)/3600*24*30/12);
            }
            if(browseCount >= 1000){
              browseCount = 500 + parseInt(Math.random()*500);
            }
          }
        listF.browseCount = browseCount;
        })
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
        _ks.run.call(_vm, _common.loadMoreDataVm,opts).then(function(){
          //_vm.initbrowseCount();
        });
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
        var opts = {};
        var operation_type;
        switch(action){
          case 'delete' : opts.operation_type = 'Often_Delete'; break;
          // case 'refresh': operation_type = 'refresh';break;
          // case 'close'  : operation_type = 'close'; break;
        }
        opts.action = action;
        _send.actionAll.call(this,opts);
      },
      deleteOne : function(listF){
        listF.checked = true;
        var opts = {
          id : [listF.id],
          action : 'delete',
        };
        _send.doActionData.call(this,opts);
      },
      closeOne : function(listF){
        listF.checked = true;
        var opts = {
          id : [listF.id],
          action : 'close',
        };
        _send.doActionData.call(this,opts);
      },
      refreshOne : function(listF){
        listF.checked = true;
        var opts = {
          id : [listF.id],
          action : 'refresh',
        };
        _send.doActionData.call(this,opts);
      }
      /** send_common E **/
    }
  };

  var sendgoodsR = Vue.extend(_sendgoodsR);
  return sendgoodsR;

});
