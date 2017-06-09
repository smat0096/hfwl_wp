define(function(require, exports, module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _findgoods = require("./findgoods-common.js");

  var template = `
<transition :name="transitionName" v-on:after-enter="initData">
<div class="weui-tab wrap  transition-wrap find_goods">
  <div class="header_box">
    <!-- 跑马灯
    <road-hourse title="恒丰物流系统"></road-hourse>
    -->
    <header-back title = "查看货源" ></header-back>

    <!--地址插件区域 S-->
    <header-choose
      @choose-callback = "chooseCallback"
      :user = "user"
    >
    </header-choose>
    <!--地址插件区域 E-->
  </div>

  <div class="content_box" style="top:90px" id="loadmore-wrap-findgoods" ref="findList">

    <pull-to-refresh
      wrap-id = 'loadmore-wrap-findgoods'
      @refresh = 'initData'
    ></pull-to-refresh>

    <loading-page
      v-show="isShowLoading"
      :loading-icon='loadingIcon'
      :loading-text="loadingText"
      :style="{top : '90px', bottom: '0'}"
    ></loading-page>

    <div class="weui-panel weui-panel_access find"  v-if="listDataF.length > 0">
      <div class="weui-panel__bd">

        <!-- goodlist -->
        <transition-group name="flip-list" tag="div">
          <findgoods-list
            v-for="listF in listDataF"
            v-bind:list-f="listF"
            v-on:show-detail="showDetail"
            v-on:add-contact="addContact"
            :key = "listF">
          </findgoods-list>
        </transition-group>
        <!-- /goodlist -->

        <loadmore-scroll
          v-on:load-more-data="loadMoreData"
          v-bind:has-more = "hasMore"
          v-bind:wrap-id = "'loadmore-wrap-findgoods'"
          v-bind:is-loading-more = "isLoadingMore"
        >
        </loadmore-scroll>

        <!--div
          class="get_goods bg_o"
          :class="{checked : isAutoTop}"
          @click="getGoods"><i class="icon_check_white"></i><span>自动滚屏</span>
        div-->

      </div>
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
</transition >
` ;

  var findGoods = {
    template : template,
    data: function(){
      return {
        'initUrl' : window._G_.url.findgoods_get,
        'loadMoreUrl' : window._G_.url.findgoods_get,
        'loadAddUrl' : window._G_.url.findgoods_get,
        'page' : 1,
        'pageAdd' : 1,
        'pageSize' : 10,
        'minId' : '',
        'transitionName' : 'in-out-translate',
        'isLoading': false,
        'isShowLoading': false,
        'hasData' : true,
        'loadingText' : '数据加载中',
        'loadingIcon' : true,
        'isLoadingMore': false,
        'hasMore' : true,
        'isShowDetail' : false,
        'listDataF': [],
        'listLimit' : 10,
        'detailData' : '',
        'cityPlugData' : {
          'fromId' : this.user.pos.cityCode,
          'from' : this.user.pos.cityName,
          'toIds' : '-1',
          'to' : '全国',
          'carLen' : '不限',
          'carType': '不限'
        }
      }
    },
    props : ['user'],
    methods : {
      initData : function(callback){
        var _vm = this;
        if(_vm.isLoading) return;
        _vm.detailData = '';
        var  data = {
          'fromId' : _vm.cityPlugData.fromId,
          'from' : _vm.cityPlugData.from,
          'toIds' : _vm.cityPlugData.toIds,
          'to' : _vm.cityPlugData.to,
          'carLen' : _vm.cityPlugData.carLen,
          'carType': _vm.cityPlugData.carType
         };
        var opts = {data : data};
        _ks.run.call(_vm, _common.initDataVm,opts).then(function(res){
          _vm.initEvent();
          _vm.minId = res.content && res.content.minId;
          _ks.run(callback);
        });
      },
      //事件钩子 S
      chooseCallback : function(data){
        this.cityPlugData = {
          'fromId' : data.from.id,
          'from' : data.from.name,
          'toIds' : data.to.id,
          'to' : data.to.name,
          'carLen' : data.car.len,
          'carType': data.car.type
        };
        this.initData();
      },
      showDetail : function(listF){
        this.detailData = listF;
        this.isShowDetail = true;
      },
      hideDetail: function() {
        this.isShowDetail = false;
      },
      addContact : function(listF){
        if(!(this.user.isAudited && this.user.isDriver )) return;
        var id = listF.id;
        if(!id) {
          console.error("点击统计ID错误", id);
          return;
        }
        var data = {
            'id' : id
        };
        return _findgoods.addContact.call(this,data);
      },
      //事件钩子 E
      initEvent : function(){
      },
      loadMoreData : function(){
        var _vm = this;
        if(_vm.isLoadingMore || _vm.isLoading || !_vm.hasMore) return;
        var data = {
              'fromId' : _vm.cityPlugData.fromId,
              'from' : _vm.cityPlugData.from,
              'toIds' : _vm.cityPlugData.toIds,
              'to' : _vm.cityPlugData.to,
              'carLen' : _vm.cityPlugData.carLen,
              'carType': _vm.cityPlugData.carType,
              'minId' : _vm.minId
            };
        var opts = {data : data};
        _ks.run.call(_vm, _common.loadMoreDataVm,opts);
      }
    },
    beforeDestroy : function() {
      _findgoods = findGoods = this.$data.listF = this.$el = this.$children = this.$parent = null;
    }
  };
  findGoods = Vue.extend(findGoods);
  return findGoods;
});
