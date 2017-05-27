define(function(require,exports,module){
"use strict";
var _template = `
<div class="loading-page" :style = "style">
  <div class='loading-page_center'>
      <div>
        <div class="loading-image"></div>
      </div>
      <div>
        <div class="ball-triangle-path" v-show="loadingIcon">
          <div></div><div></div><div></div>
        </div>
        <span class="weui-loadmore__tips" style="color:#f60" v-text="loadingText">数据加载中</span>
      </div>
  </div>
</div>
  `;

  return Vue.extend({
        template: _template,
        props: ['loadingIcon','loadingText', 'style'],
        replace:true
    });
})
