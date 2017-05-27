define(function(require,exports,module){
"use strict";
var _template = `
<div class="weui-panel__ft loadmore-link">
  <div class="loadmore-link_bd">
    <a 
      href="javascript:void(0);" 
      class="weui-cell weui-cell_access weui-cell_link" 
      @click="loadMoreData"
      v-show="hasMore && !isLoadingMore"
    >
      <div class="weui-cell__bd">查看更多</div>
      <span class="weui-cell__ft"></span>
    </a>
    <div 
      class="weui-cell" 
      v-show="hasMore && isLoadingMore">
      <div class="weui-cell__bd text-center">
        <i class="weui-loading"></i>
        <span class="weui-loadmore__tips">正在加载</span>
      </div>
    </div>
    <div 
      class="weui-cell" 
      v-show="!hasMore">
      <div class="weui-cell__bd">
        <p>已全部加载 ...</p>
      </div>
    </div>
  </div>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        props: ['hasMore','isLoadingMore'],
        methods: {
          'loadMoreData' : function() {
            if(this.isLoadingMore) return;
            this.$emit('load-more-data');
          },
        }
    });
})
