define(function(require, exports, module) {
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _carport = require("./carport-common.js");

  var template = `
<div class="wrap transition-wrap bg_f0" >

  <div class="header_box carport_header_box">
    <header-back title = "联系记录" ></header-back>
  </div>

  <div class="content_box carport_content_box bg_f0"  style="top:50px;" id="loadmore-wrap-carport-msg">

    <pull-to-refresh
      wrap-id = 'loadmore-wrap-carport-msg'
      @refresh = 'initData'
    ></pull-to-refresh>

    <loading-page 
      v-show="isShowLoading"
      :loading-icon='loadingIcon'
      :loading-text="loadingText"
    ></loading-page>
    
    <div class="weui-panel__bd car_lists">
    
      <!-- car_list S -->
      <car-list
        v-for="listF in listDataF"
        v-bind:list-f="listF" 
        :key="listF.id"
        v-on:show-detail="showDetail"
        v-on:add-known="addKnown"
        v-on:add-contact="addContact"
        v-on:remove-known="removeKnown">
      </car-list>
      <!-- car_list E -->

      <loadmore-scroll 
        v-on:load-more-data="loadMoreData"
        v-bind:has-more = "hasMore"
        v-bind:wrap-id = "'loadmore-wrap-carport-msg'"
        v-bind:is-loading-more = "isLoadingMore"
      >
      </loadmore-scroll>
    </div>
  </div>

  <!-- 详细资源 -->
  <car-detail 
    v-bind:is-show-detail="isShowDetail" 
    v-bind:list-f="detailData" 
    v-on:hidedetail="hideDetail"
    v-on:add-known="addKnown"
    v-on:remove-known="removeKnown"
    v-on:add-contact="addContact"
    v-on:post-comment="postComment"
  ></car-detail>

</div>
`
  var _carportMsg = {
    template : template,
    data: function(){
      return {
        'transitionName' : 'in-out-translate-fade',
        'page' : 1,
        'minId' : '',
        
        'initUrl' : window._G_.url.carport_contact_get,
        'loadMoreUrl' : window._G_.url.carport_contact_get,
        'addKnownUrl' : window._G_.url.carport_source_act_addKnown,
        'postCommentUrl' : window._G_.url.carport_known_act_comment,
        
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
        'detailData' : ''
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
        var  data = {
          // 'userId' : _vm.user.id,
          // 'fromId' : _vm.cityPlugData.fromId,
          // 'from' : _vm.cityPlugData.from,
          // 'toIds' : _vm.cityPlugData.toIds,
          // 'to' : _vm.cityPlugData.to,
          // 'carLen' : _vm.cityPlugData.carLen,
          // 'carType': _vm.cityPlugData.carType
         };
         var opts = {
          formatType : 'carport',
          pos : this.user.pos,
          data : data
        };
        _ks.run.call(_vm,_common.initDataVm,opts).then(function(res){
          _vm.initEvent();
          _ks.run(callback);
        });
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
            'carId' : listF.id,
            'action' : 'addKnown'
          },
          msgSuccess : '添加成功',
          msgError : '网络错误,添加熟车失败'
        };
        _ks.run.call(_vm,_carport.postDataVm,opts)
        .done(function(res){
          Vue.set(listF,'isKnown',true);
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
            'carId' : listF.id,
            'action' : 'removeKnown'
          },
          msgSuccess : '删除成功',
          msgError : '网络错误,删除熟车失败'
        };
        _ks.run.call(_vm,_carport.postDataVm,opts)
        .done(function(res){
          Vue.set(listF,'isKnown',false);
        });
      },
      /** 需加载事件 **/
      initEvent : function(){
      },
      /** v-on的事件 * */
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
        _ks.run.call(this, _common.loadMoreDataVm, opts);
      },
      postComment: function(listF){
        var _vm = this;
        if(_vm.isPosting) return;
        var opts = {
          url : _vm.postCommentUrl,
          data : {
              'listDataType' : _vm.listDataType,
              'userId' : _vm.user.id,
              'carId' : listF.id,
              'action' : 'editComment',
              'comment' : listF.comment
            },
            msgSuccess : '编辑成功',
            msgError : '网络错误,编辑失败'
        };
        _ks.run.call(_vm, _carport.postDataVm,opts);
      },
      addContact : function(listF){
        if(!(this.user.isAudited && ( this.user.isSender || this.user.isFactory ))) return;
        var data = {
          carId : listF.carId,
          collectId : listF.collectId
        }
        _carport.addContact.call(this, data);
      }
    }
  };
  var carportMsg = Vue.extend(_carportMsg);
  return carportMsg;
});
