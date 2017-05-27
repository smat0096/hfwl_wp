define(function(require,exports,module){
"use strict";
var _template = `
<div class="road_hourse" id="road_box">
    <table>
    <tbody><tr>
    <td id="js_road1">
      <span v-text="title"></span>
      </td>
    <td id="js_road2"></td>
    </tr>
    </tbody></table>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data: function(){
          return {
            timer : null
          }
        },
        props: ['title'],
        mounted: function(){
          this.startRoad();
        },
        beforeDestroy: function(){
          this.stopRoad();
        },
        methods : {
          startRoad : function(){
            var _vm = this;
            clearInterval(_vm.timer);
            function t() {
              n.scrollLeft >= a.scrollWidth ? n.scrollLeft = 0 : n.scrollLeft++
            }
            var i = 50,
              a = document.getElementById("js_road1"),
              e = document.getElementById("js_road2"),
              n = document.getElementById("road_box");
            if (a && e) {
              e.innerHTML = a.innerHTML;
              _vm.timer = setInterval(t, i);
              n.onmouseover = function() {
                clearInterval(_vm.timer)
              };
              n.onmouseout = function() {
                _vm.timer = setInterval(t, i)
              }
            };
          },
          stopRoad : function(){
            var _vm = this;
            clearInterval(_vm.timer);
          }
        }

    });
})
