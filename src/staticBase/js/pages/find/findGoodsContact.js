define(function(require, exports, module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _findgoods = require("./findgoods-common.js");

var template = `
<transition :name="transitionName" v-on:after-enter="initData">
<div class="wrap  transition-wrap find_goods" >

  <header-back title = "联系货源" ></header-back>
  <div class="content_box JS_find_list" style="top:50px" id="js_findgoods_contact_list">

    <pull-to-refresh
      wrap-id = 'js_findgoods_contact_list'
      @refresh = 'initData'
    ></pull-to-refresh>

    <loading-page
      v-show="isShowLoading"
      :loading-icon='loadingIcon'
      :loading-text="loadingText"
    ></loading-page>

    <div class="weui-panel weui-panel_access find"  v-if="listDataF.length > 0">
      <div class="weui-panel__bd">

        <!-- goodlist -->
        <findgoods-list
          v-for="(listF, index) in listDataF"
          v-bind:list-f="listF"
          :key = "listF.id"
          v-on:add-contact="addContact"
          v-on:show-detail="showDetail"
        ></findgoods-list>
        <!-- /goodlist -->

      </div>

      <!-- 查看更多 -->
      <loadmore-link
        v-on:load-more-data="loadMoreData"
        v-bind:has-more = "hasMore"
        v-bind:is-loading-more = "isLoadingMore"
      >
      </loadmore-link>

    </div>
  </div>

  <!-- 详细资源 -->
  <find-detail
    v-bind:is-show-detail="isShowDetail"
    v-bind:list-f="detailData"
    v-on:hidedetail="hideDetail"
    v-on:add-contact="addContact"
    >
  </find-detail>
</div>
</transition>
`;

  var _findGoodsContact = {
    template : template,
    data: function(){
      return {
        'page' : 1,
        'pageSize' : 10,
        'minId' : '',

        'hasData' : true,
        'hasMore' : true,
        'isLoading': false,
        'isShowLoading': false,
        'isLoadingMore' : false,
        'loadingText' : '数据加载中',
        'loadingIcon' : true,

        'initUrl' : window._G_.url.findgoodsContact_get,
        'loadMoreUrl' : window._G_.url.findgoodsContact_get,

        'transitionName' : 'in-out-translate-fade',

        'isShowDetail' : false,
        'listData': [],
        'listDataF': [],
        'detailData' : ''
      }
    },
    props : ['user'],
    // mounted : function(){
    //   this.initData();
    // },
    methods : {
      initData : function(callback){
        var _vm = this;
        if(_vm.isLoading) return;
        _vm.detailData = '';
        _ks.run.call(_vm, _common.initDataVm).then(function(res){
          _vm.initEvent();
          _ks.run(callback);
        });
      },
      //事件钩子 S
      initEvent : function(){},
      showDetail : function(listF){
        this.detailData = listF;
        this.isShowDetail = true;
      },
      hideDetail: function() {

        this.isShowDetail = false;
      },
      //事件钩子 E
      loadMoreData : function(){
        var _vm = this;
        if(_vm.isLoadingMore || _vm.isLoading || !_vm.hasMore) return
        _ks.run.call(this, _common.loadMoreDataVm);
      },
      addContact : function(listF){
        var id = listF.id;
        if(!id) {
          console.error("点击统计ID错误", id);
          return;
        }
        var data = {
            'id' : id
        };
        return _findgoods.addContact.call(this,data);
      }
    }
  };
  var findGoodsContact = Vue.extend(_findGoodsContact);
  return findGoodsContact;

});
