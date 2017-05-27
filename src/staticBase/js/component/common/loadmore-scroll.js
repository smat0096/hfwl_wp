define(function(require,exports,module){
"use strict";
var _template = `
<div class="loadmore-scroll">
  <div class="">
    <div class="weui-loadmore text-center" v-show="hasMore && isLoadingMore">
      <p class="text-center">
        <div class="ball-triangle-path">
          <div></div><div></div><div></div>
        </div>
        <span class="weui-loadmore__tips c_o">正在加载</span>
      </p>
    </div>
    <div 
      v-show="!hasMore">
      <div class="text-center">
        <p>已全部加载 ...</p>
      </div>
    </div>
  </div>
</div>
  `;

  var loadmoreScroll = Vue.extend({
        template: _template,
        replace:true,
        props: ['hasMore','isLoadingMore','wrapId'],
        mounted : function(){
          this.initScrollLoadingEvent();
        },
        methods: {
          'loadMoreData' : function() {
            if(this.isLoadingMore || !this.hasMore) return;
            this.$emit('load-more-data');
          },
          'initScrollLoadingEvent' : function(){
            var _this = this;
            var _select = '#'+this.wrapId;
            var distance = 100;
            $(_select).infinite(distance).on("infinite", function() {
              _this.loadMoreData();
            });
          },
        },
    });
  //Vue.extend('loadmore-scroll', loadmoreScroll)
  return loadmoreScroll;
})
