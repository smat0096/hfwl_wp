define(function(require,exports,module){
  "use strict";
  var _template = `
  <div class="weui-pull-to-refresh__layer">
    <div class='weui-pull-to-refresh__arrow'></div>
    <div class='weui-pull-to-refresh__preloader'></div>
    <div class="down">下拉可刷新</div>
    <div class="up">释放可刷新</div>
    <div class="refresh">正在刷新中...</div>
  </div>
    `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
            }
        },
        mounted: function(){
          this.pullToRefresh();
        },
        props: ['wrapId'],
        methods:{
          pullToRefresh : function(){
            var _vm = this;
            $('#'+this.wrapId).pullToRefresh().on('pull-to-refresh', function (done) {
              //刷新页面
              //window.location.reload();
              
              //重置数据
              var self = this;
              _vm.$emit('refresh',function(){
                $(self).pullToRefreshDone();
              });
            });
          }
        }
    });
})
