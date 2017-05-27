define(function(require,exports,module){
"use strict";
var _template = `
<transition :name="transitionName">
<div class="weui-search-bar weui-search-bar_focusing"  v-show="isShow" style="z-index: 10;">
  <form class="weui-search-bar__form">
    <div class="weui-search-bar__box">
      <i class="weui-icon-search"></i>
      <input type="search" class="weui-search-bar__input" placeholder="搜索" required="" v-model="searchValue">
      <a href="javascript:" class="weui-icon-clear" @click="searchClear"></a>
    </div>
  </form>
  <a href="javascript:" class="ks_weui-search-bar__cancel-btn" @click="search">搜索</a>
</div>
</transition>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data() {
            return {
                transitionName : 'slide-y-2',
                searchValue : ''
            }
        },
        props: {
            isShow: Boolean
        },
        created() {
            
        },
        methods: {
            search : function(){
                this.$emit('search',this.searchValue)
            },
            searchClear : function(){
                this.searchValue = '';
            }
        }
    });
})
