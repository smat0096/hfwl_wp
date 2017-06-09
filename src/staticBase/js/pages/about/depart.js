define(function(require, exports, module) {
  var cityData = require('utils/kspicker/cityData.js');

  var template = `
<transition :name="transitionName" v-on:after-enter="initData">
<div class="wrap transition-wrap">

  <div class="header_box carport_header_box">
    <header-back title = "附近停车场" ></header-back>

    <!-- 城市 S -->
    <div class="weui-cells weui-cells_form mt_0">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">
            选择城市
          </label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input"
            type="text"
            autocomplete="off"
            placeholder="请选择地址"
            v-model="fromName"
            name="fromName"
            readonly
            @click="showFromPicker"
          />
          <input class="weui-input"
            type="hidden"
            v-model="fromCode"
            readonly
            name="fromCode"
          />
        </div>
      </div>
    </div>
    <!-- 城市 E -->
  </div>

  <div class="content_box carport_content_box"  style="top:90px;" id="loadmore-wrap-deport">

      <pull-to-refresh
      wrap-id = 'loadmore-wrap-deport'
      @refresh = 'initData'
    ></pull-to-refresh>

    <loading-page
      v-show="isShowLoading"
      :loading-icon='loadingIcon'
      :loading-text="loadingText"
      style="top:90px;"
    ></loading-page>

    <div class="weui-panel__bd car_lists">

      <!-- depart_list S -->
      <depart-list
        v-for="listF in listDataF"
        v-bind:list-f="listF"
        :key="listF.id"
        v-on:show-detail="showDetail"
      ></depart-list>
      <!-- depart_list E -->

      <loadmore-scroll
        v-on:load-more-data="loadMoreData"
        v-bind:has-more = "hasMore"
        v-bind:wrap-id = "'loadmore-wrap-deport'"
        v-bind:is-loading-more = "isLoadingMore"
      >
      </loadmore-scroll>
    </div>
  </div>

  <!-- 详细资源 -->
  <depart-detail
    v-bind:is-show-detail="isShowDetail"
    v-bind:list-f="detailData"
    v-on:hidedetail="hideDetail"
    v-on:post-comment="postComment">
  </depart-detail>
  <picker-footer
    v-bind:is-show="isShowPicker"
    v-bind:picker="picker"
    v-on:hide="hidePicker"
  ></picker-footer>
</div>
</transition>
`;
  var _carportSource = {
    template : template,
    data: function(){
      return {
        //ks_chage_ajaxUrl
        'initUrl' : window._G_.url.carport_source_get,
        'loadMoreUrl' : window._G_.url.carport_source_get,
        'addKnownUrl' : window._G_.url.carport_source_act_addKnown,
        'postCommentUrl' : window._G_.url.carport_known_act_comment,

        'transitionName' : 'in-out-translate',
        'page' : 1,
        'radius' : 10000,
        'query' : ["恒丰物流", "物流园"],

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
          'from' : '',
          'fromPos' : ''
        },

        'isShowPicker' : '',
        'picker' : '',
        'fromPicker' : '',
        'fromName' : this.user.pos.cityName,
        'fromCode' : ''
      }
    },
    props : ['user'],
    watch:{
      fromName : function(){
        this.initData();
      }
    },
    methods : {
      initData : function(callback){
        var _vm = this;
        if(_vm.isLoading) return;
        _vm.isLoading = true;
        _vm.isShowLoading = true;
        _vm.loadingText = '数据加载中';
        _vm.listDataF = [];
        _vm.searchDeparts(function(arr){
          _vm.listDataF = arr;
          _vm.isLoading = false;
          _ks.run(callback);
        });
      },
      "showFromPicker": function() {
        var _this = this;
        var  opts = {
          title : '请选择城市',
          'multiple' : 0,
          'subClass' : 'sub',
          'actClass' : 's',
          'isShowBack' : true,
          //'isShowValue' : true,
          'isShowCurrPath' : true,
          'length' : 2,
          data : cityData,
          extend : {
            afterPicker : function(picker){
              var city = picker.valueText;
              //city = KsMap.fn.getCityByAddress(city);
              _this.fromName = city;
              _this.fromCode = KsMap.fn.getCityCodeByCity(city);
              _this.hidePicker();
            }
          }
        };
        _this.fromPicker = _this.fromPicker || Picker(opts);
        _this.fromPicker.goTop();
        _this.picker = _this.fromPicker;
        this.isShowPicker = true;
      },
      "hidePicker": function(listF){
        this.isShowPicker = false;
      },
      searchDeparts : function(callback){
        var _vm = this;
        window.ksmap = window.ksmap || KsMap();
        ksmap.getPosition(_vm.fromName,function(point){
          if(!point) {
              _vm.loadError(callback);
              return;
          }
          var opts = {
            center : ksmap.makePoint(point), //查询中心点_vm.user.pos.point
            radius : _vm.radius*_vm.page, //半径
            query : _vm.query, //查询目标
            type : 'local', //lbs ,local,bound ,查询方式
            renderOptions : null,
            success : function(res){
              _vm.isShowLoading = false;
              _ks.run(callback,_vm.formatDeparts(res));
            },
            error : function(){
              _vm.loadError(callback);
            }
          };
          ksmap.localSearch(opts);
        })
      },
      loadError : function(callback){
        var _vm = this;
        _vm.loadingText = '无匹配数据';
        _vm.isShowLoading = true;
        _ks.run(callback, _vm.formatDeparts([]));
      },
      formatDeparts :function(res){
        var _vm  = this,
            iL ,
            temp,s,arr=[];
        for(var j=0; j<res.length; j++){
          iL = res[j].getCurrentNumPois();
          if(iL > 0){
            for(var i= 0; i< iL;i++){
              temp = res[j].getPoi(i);
              temp.avatarUrl = window._G_.url.basicUrl+"/static/img/ic_launcher.png";
              temp.ks_distance = ksmap.getDistance(_vm.user.pos.point, temp.point);
              s = '';
              s += temp.province ? temp.province : '';
              s += temp.city ? temp.city : '';
              s += temp.address ? temp.address : '';
              temp.ks_address = s;
              temp.userPoint = _vm.user.pos.point;
              arr.push(temp);
            }
          }else if(res[j].keyword =='恒丰物流'){
            temp = res[j];
              temp.avatarUrl = window._G_.url.basicUrl+"/static/img/ic_launcher.png";
              temp.point = ksmap.makePoint({lng: '113.172664', lat: '25.803731'})
              temp.ks_distance = ksmap.getDistance(_vm.user.pos.point, temp.point)
              temp.userPoint = _vm.user.pos.point;
              temp.title = '恒丰物流园';
              temp.ks_address = '湖南省郴州市高新区技术产业园金鑫路恒丰物流园';
              temp.phoneNumber = '0735-2656938';
              arr.push(temp);
          }
        }
        return  arr;
      },
      //事件钩子 S
      showDetail : function(listF){
        return;
        this.detailData = listF;
        this.isShowDetail = true;

      },
      hideDetail: function() {
        this.isShowDetail = false;
      },
      /** 需加载事件 **/
      /** v-on的事件 * */
      loadMoreData : function(){
      },
      postComment: function(listF){
      }
    }
  };
  var carportSource = Vue.extend(_carportSource);
  return carportSource;
});
