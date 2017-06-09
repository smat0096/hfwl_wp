define(function(require, exports, module) {
  "use strict";
  var template = `
<transition :name="transitionName"  v-on:after-enter="initData">
<div class="wrap  transition-wrap publish_goods ">

  <header-back
    title = "我的推荐"
    @right-event = "toggleSearchBar"
    :right-text="headerRightIcon"
  ></header-back>

  <div class="content_box"  style="top:50px; bottom: 10px">
    <div class="weui-tab">
      <div class="weui-navbar">
        <a
          class="weui-navbar__item weui-navbar__orange"
          :class="{ 'weui-bar__item--on' : listDataType == 'businessRAuditing'}"
          href="javascript:;"
          @click = "getTypedData('businessRAuditing')"
          >
          认证中
        </a>
        <a
          class="weui-navbar__item weui-navbar__orange"
          :class="{ 'weui-bar__item--on' : listDataType == 'businessRSuccess'}"
          href="javascript:;"
          @click = "getTypedData('businessRSuccess')"
          >
          认证成功
        </a>
        <a
          class="weui-navbar__item weui-navbar__orange"
          :class="{ 'weui-bar__item--on' : listDataType == 'businessRFailed'}"
          href="javascript:;"
          @click = "getTypedData('businessRFailed')"
          >
          认证失败
        </a>
        <a
          class="weui-navbar__item weui-navbar__orange"
          :class="{ 'weui-bar__item--on' : listDataType == 'businessRSummary'}"
          href="javascript:;"
          @click = "getTypedData('businessRSummary')"
          >
          统计
        </a>
      </div>

      <div class="weui-tab__bd">
        <div class="weui-tab__bd-item weui-tab__bd-item--active"  id="loadmore-wrap-businessR"  style="width:100%">

          <pull-to-refresh
            wrap-id = 'loadmore-wrap-businessR'
            @refresh = 'initData'
          ></pull-to-refresh>

          <loading-page
            v-show="isShowLoading"
            :loading-icon='loadingIcon'
            :loading-text="loadingText"
          ></loading-page>

          <transition-group name="flip-list" tag="div">

            <search-bar
              key = 'searchBar'
              :is-show = "isShowSearchBar"
              @search = "searchBusinessR"
            ></search-bar>

            <div v-show="isShowList" key='recoment'>
              <transition-group name="flip-list" tag="div">
                <div class="weui-panel weui-panel_access mt_0" key='weuiPanel'>

                  <div class="weui-panel__bd">
                    <!-- content_box_list S-->
                    <transition-group name="flip-list" tag="div">
                      <business-list
                        v-for="listF in listDataF"
                        v-bind:list-f = "listF"
                        v-bind:list-data-type = "listDataType"
                        :key = "listF"
                      ></business-list>
                    </transition-group>
                    <!-- content_box_list E-->
                  </div>

                  <loadmore-scroll
                    v-on:load-more-data="loadMoreData"
                    v-bind:has-more = "hasMore"
                    v-bind:wrap-id = "'loadmore-wrap-businessR'"
                    v-bind:is-loading-more = "isLoadingMore"
                  >
                  </loadmore-scroll>

                </div>
              </transition-group>
            </div>

            <div v-show="!isShowList" class='table-responsive pd-15 mg_t-30' key='summary'>
              <table class='table table-bordered'>
                <thead>
                  <tr>
                    <td><p>统计</p></td>
                    <td><p>推荐人数</p></td>
                    <td><p>认证人数</p></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><p>本月: </p></td>
                    <td><p>{{ user.data.businessCurrMonthCommend }}</p></td>
                    <td><p>{{ user.data.businessCurrMonthAudited }}</p></td>
                  </tr>
                  <tr>
                    <td><p>上月: </p></td>
                    <td><p>{{ user.data.businessPrevMonthCommend }}</p></td>
                    <td><p>{{ user.data.businessPrevMonthAudited }}</p></td>
                  </tr>
                  <tr>
                    <td><p>总计: </p></td>
                    <td><p>{{ user.data.businessSumCommend }}</p></td>
                    <td><p>{{ user.data.businessSumAudited }}</p></td>
                  </tr>
                </tbody>
              </table>
            </div>

          </transition-group>

        </div>
      </div>

    </div>
  </div>

</div>
</transition>
`
  var businessR = {
      template : template,
      data: function(){
        return {
        'transitionName': 'in-out-translate',
        'page' : 1,
        'G' : window._G_,
        'minId' : '',
        'isLoading': false,
        'isShowLoading': false,
        'hasData' : true,
        'loadingText' : '数据加载中',
        'loadingIcon' : true,
        'isLoadingMore': false,
        'hasMore' : true,

        'headerRightIcon' : "<i class='weui-icon-search' style='color: #fafafa;font-size:16px'></i>",
        'isShowSearchBar' : false,

        'listDataF' : [],
        'isShowList' : true,

        'listDataType' : 'businessRAuditing'
        ,'initUrl' : window._G_.url.business_r_get
        ,'loadMoreUrl' : window._G_.url.business_r_get
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
          'searchValue' : this.searchValue
        };
        var opts = {data : data};
        _ks.run.call(_vm, _common.initDataVm,opts).then(function(){
          _ks.run(callback);
        });
      },
      getTypedData : function(type){
        if(type) this.listDataType = type;
        if(type === 'businessRSummary'){
          this.isShowList = false;
          this.isShowLoading = false;
        }else{
          this.isShowList = true;
          this.initData();
        }
      },
      loadMoreData : function(){
        var _vm = this;
        if(_vm.isLoadingMore || _vm.isLoading || !_vm.hasMore) return
        var data = {
              'listDataType' : this.listDataType,
              'searchValue' : this.searchValue
            };
        var opts = {data : data};
        _ks.run.call(_vm, _common.loadMoreDataVm,opts);
      },
      toggleSearchBar : function(){
        this.isShowSearchBar = !this.isShowSearchBar
      },
      searchBusinessR : function(searchValue){
        this.searchValue = searchValue;
        this.initData();
      }
      /** send_common S **/

      /** send_common E **/
    }
  };

  businessR = Vue.extend(businessR);
  return businessR;

});
