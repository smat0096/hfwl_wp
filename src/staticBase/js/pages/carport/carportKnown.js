define(function(require, exports, module) {
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _carport = require("./carport-common.js");

  var template = `
<div class="wrap transition-wrap bg_f0" id="carport-known">

  <div class="header_box carport_header_box">
    <header-back title = "熟车" ></header-back>
    <!--地址插件区域 S-->
    <header-choose
      @choose-callback = "chooseCallback"
      :user = "user"
    >
    </header-choose>
    <!--地址插件区域 E-->
    
    <div class="btn_box carport_btn_box bg_f0">
      <router-link to="/carportAdd" class="btn bg_o">
        <span class="add_con_white mr_5"></span>
        <span class="f18 " style="vertical-align: middle;">手动添加</span>
      </router-link>
    </div>

  </div>

  <div class="content_box carport_content_box bg_f0"  style="top:150px; bottom: 50px; -padding: 0 15px;" id="loadmore-wrap-carport-known">

    <pull-to-refresh
      wrap-id = 'loadmore-wrap-carport-known'
      @refresh = 'initData'
    ></pull-to-refresh>
    
    <loading-page 
      v-show="isShowLoading"
      :loading-icon='loadingIcon'
      :loading-text="loadingText"
      :style="{top : '90px', bottom: '0'}"
    ></loading-page>

    <div class="weui-panel__bd car_lists">

      <!-- car_list S  v-show 不显示熟车列表的移除信息 待更新 -->
      <transition-group name="flip-list" tag="div">
      <car-list
        v-for="listF in listDataF"
        v-bind:list-f="listF" 
        :key="listF.id"
        v-show="listF.isKnown"
        v-on:show-detail="showDetail"
        v-on:add-known="addKnown"
        v-on:add-contact="addContact"
        v-on:remove-known="removeKnown">
      </car-list>
      </transition-group>
      <!-- car_list E -->

      <loadmore-scroll 
        v-on:load-more-data="loadMoreData"
        v-bind:has-more = "hasMore"
        v-bind:wrap-id = "'loadmore-wrap-carport-known'"
        v-bind:is-loading-more = "isLoadingMore"
      >
      </loadmore-scroll>
    </div>
  </div>

  <!-- 详细资源 v-show 不显示熟车列表的移除信息 待更新 -->
  <car-detail 
    v-bind:is-show-detail="isShowDetail" 
    v-bind:list-f="detailData" 
    v-show="detailData.isKnown"
    v-on:hidedetail="hideDetail"
    v-on:add-known="addKnown"
    v-on:add-contact="addContact"
    v-on:remove-known="removeKnown"
    v-on:post-comment="postComment"
  ></car-detail>
</div>
`;
  var _carportKnown = {
    template : template,
    data: function(){
      return {
        //ks_chage_ajaxUrl
        'initUrl' : window._G_.url.carport_known_get,
        'loadMoreUrl' : window._G_.url.carport_known_get,
        'addKnownUrl' : window._G_.url.carport_known_act_addKnown,
        'postCommentUrl' : window._G_.url.carport_known_act_comment,
        
        'minId' : '',
        'transitionName' : 'in-out-translate-fade',
        'page' : 1,

        'isLoading': false,
        'isShowLoading': false,
        'hasData' : true,
        'loadingText' : '数据加载中',
        'loadingIcon' : true,
        'isLoadingMore': false,
        'hasMore' : true,

        'isPosting' : false,
        'isPostingComment' : false,
        'listDataF' : [],
        'listDataType' : 'carportKnown',
        'isShowDetail' : false,
        'isShowMap' : false,
        'detailData' : '',
        'cityPlugData' : {
          'fromId' : '-1',
          'from' : '全国',
          'toIds' : '-1',
          'to' : '全国',
          'carLen' : '不限',
          'carType': '不限'
        }
      }
    },
    props : ['user'],
    mounted : function(){
      //this.initData();
    },
    methods : {
      initData : function(callback){
        var _vm = this;
        if(_vm.isLoading) return;
        var  data = {
          'fromId' : _vm.cityPlugData.fromId,
          'from' : _vm.cityPlugData.from,
          'toIds' : _vm.cityPlugData.toIds,
          'to' : _vm.cityPlugData.to,
          'carLen' : _vm.cityPlugData.carLen,
          'carType': _vm.cityPlugData.carType
         };
         var opts = {
          formatType : 'carport',
          pos : this.user.pos,
          data : data
        };
        _ks.run.call(_vm, _common.initDataVm,opts).then(function(res){
          _vm.initEvent();
          _ks.run(callback);
        });
      },
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
      //事件钩子 S
      showDetail : function(listF){
        this.detailData = listF;
        this.isShowDetail = true;

      },
      hideDetail: function() {
        this.isShowDetail = false;
        
      },
      addKnown : function(listF){
        var _vm = this;
        if(_vm.isPosting) return;
        if(!(this.user.isAudited && ( this.user.isSender || this.user.isFactory ))) return;
        var opts = {
          url : _vm.addKnownUrl,
          data : {
            'userId' : _vm.user.id,
            'collectId' : listF.collectId,
            'action' : 'addKnown'
          },
          msgSuccess : '添加成功',
          msgError : '网络错误,添加熟车失败'
        };
        _ks.run.call(_vm,_carport.postDataVm,opts)
        .done(function(res){
          if(res.status==="OK"){
            Vue.set(listF,'isKnown',true);
          }
        });
      },
      removeKnown : function(listF){
        var _vm = this;
        if(_vm.isPosting) return;
        if(!(this.user.isAudited && ( this.user.isSender || this.user.isFactory ))) return;
        var opts = {
          url : _vm.addKnownUrl,
          data : {
            'userId' : _vm.user.id,
            'collectId' : listF.collectId,
            'action' : 'removeKnown'
          },
          msgSuccess : '删除成功',
          msgError : '网络错误,删除熟车失败'
        };
        _ks.run.call(_vm,_carport.postDataVm,opts)
        .done(function(res){
          if(res.status==="OK"){
            Vue.set(listF,'isKnown',false);
          }
        });
      },
      /** 需加载事件 **/
      initEvent : function(){
      },
      loadMoreData : function(){
        var _vm = this;
        if(_vm.isLoadingMore || _vm.isLoading || !_vm.hasMore) return;
        var opts = {
          formatType : 'carport',
          pos : this.user.pos,
          data : {
            'listDataType' : this.listDataType,
          }
        }
        _ks.run.call(this,_common.loadMoreDataVm,opts);
      },
      postComment: function(listF){
        var _vm = this;
        if(_vm.isPosting) return;
        var opts = {
          url : _vm.postCommentUrl,
          data : {
              'listDataType' : _vm.listDataType,
              'userId' : _vm.user.id,
              'collectId' : listF.collectId,
              'action' : 'editComment',
              'comment' : listF.comment
            },
          msgSuccess : '编辑成功',
          msgError : '网络错误,编辑失败'
        };
        _ks.run.call(_vm,_carport.postDataVm,opts);
      },
      addContact : function(listF){
        return;//TOFIX 熟车只能确定 collectId ,不能确定 carId,因此无法添加到联系列表
        var data = {
          carId : listF.carId,
          collectId : listF.collectId
        }
        _carport.addContact.call(this, data);
      }
    }
  };
  var carportKnown = Vue.extend(_carportKnown);
  return carportKnown;
});
