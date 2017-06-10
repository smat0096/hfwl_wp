define(function(require, exports, module) {
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _carport = require("./carport-common.js");

  var template = `
<transition :name="transitionName" v-on:after-enter="initData">
<div class="wrap transition-wrap">
  <div class="header_box carport_header_box">
    <header-back title = "车源信息" ></header-back>

    <!--地址插件区域 S-->
    <header-choose
      @choose-callback = "chooseCallback"
      :user = "user"
    >
    </header-choose>
    <!--地址插件区域 E-->

  </div>

  <div class="content_box carport_content_box"  style="top:90px; bottom: 50px" id="loadmore-wrap-carport-source">

      <pull-to-refresh
      wrap-id = 'loadmore-wrap-carport-source'
      @refresh = 'initData'
    ></pull-to-refresh>

    <loading-page
      v-show="isShowLoading"
      :loading-icon='loadingIcon'
      :loading-text="loadingText"
      :style="{top : '90px', bottom: '0'}"
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
        v-bind:wrap-id = "'loadmore-wrap-carport-source'"
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
    v-on:post-comment="postComment">
  </car-detail>

</div>
</transition>
`;
  var carportSource = {
    template : template,
    data: function(){
      return {
        //ks_chage_ajaxUrl
        'initUrl' : window._G_.url.carport_source_get,
        'loadMoreUrl' : window._G_.url.carport_source_get,
        'addKnownUrl' : window._G_.url.carport_source_act_addKnown,
        'postCommentUrl' : window._G_.url.carport_known_act_comment,

        'minId' : '',
        'transitionName' : 'in-out-translate',
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
          'fromId' : this.user.pos.cityCode,
          'from' : this.user.pos.cityName,
          'toIds' : '',
          'to' : '',
          'carLen' : '',
          'carType': ''
        }
      }
    },
    props : ['user'],
    mounted : function(){
      //this.initData();
    },
    beforeDestroy : function() {
      this.$data.listF = this.$el = this.$children = this.$parent = null;
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
        _common.initDataVm.call(_vm, opts).then(function(res){
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
            'carId' : listF.carId,
            'action' : 'addKnown'
          },
          msgSuccess : '添加成功',
          msgError : '网络错误,添加熟车失败'
        };
        _ks.run.call(_vm, _carport.postDataVm,opts)
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
            'carId' : listF.carId,
            'action' : 'removeKnown'
          },
          msgSuccess : '删除成功',
          msgError : '网络错误,删除熟车失败'
        };
        _ks.run.call(_vm, _carport.postDataVm,opts)
        .done(function(res){
          if(res.status==="OK"){
            Vue.set(listF,'isKnown',false);
          }
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
        _ks.run.call(this, _common.loadMoreDataVm,opts);
      },
      postComment: function(listF){
        var _vm = this;
        if(_vm.isPosting) return;
        var opts = {
          url : _vm.postCommentUrl,
          data : {
              'listDataType' : _vm.listDataType,
              'userId' : _vm.user.id,
              'carId' : listF.carId,
              'action' : 'editComment',
              'comment' : listF.comment
            },
            'msgSuccess' : '编辑成功',
            'msgError' : '网络错误,编辑失败'
        };
        _ks.run.call(_vm, _carport.postDataVm,opts);
      },
      addContact : function(listF){
        if(!(this.user.isAudited && ( this.user.isSender || this.user.isFactory ))) return;
        var data = {
          carId : listF.carId
        }
        _carport.addContact.call(this, data);
      }
    }
  };
  return Vue.extend(carportSource);
});
