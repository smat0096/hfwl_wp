define(function(require,exports,module){
"use strict";
var _template = `
<transition :name="transitionName" v-on:after-enter="showType">
  <div class="bmap tab_box" v-show="isShow">  
  <!-- v-show="isShowMap" -->
    <div class="wrap">
      <div class="header_box">
        <header-back 
          title = "地图详情"
          v-bind:left-type = "true"
          v-on:left-event = "hideMap"
        ></header-back>
      </div>
      <div class="content_box loading_bg content_box_bottom"  id="bmap"></div>
      <div class="footer_box">
        <p class="map_msg">{{ mapMessage }} </p>
      </div>
    </div>
  </div>
</transition>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              'transitionName': 'in-out-translate-fade'
            }
        },
        computed:{
          isShow: function(){
            return this.$store.state.map.isShow;
          },
          mapMessage: function(){
            return this.$store.state.map.message;
          }
        },
        methods: {
          hideMap: function() {
            this.$store.commit('map_hide');
            //this.$emit('hide-map');
          },
          showType : function(){
            this.$store.dispatch('map_show_type');
          }
        }
    });
})
