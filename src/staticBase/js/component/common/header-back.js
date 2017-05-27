define(function(require,exports,module){
"use strict";
var _template = `
  <div class="header_bar clearfix">
    <a class="left" 
      v-if="!noLeft"
      href="javascript:;" 
      @click="leftEvent"
    >
      <i class="icon_left"></i>
    </a>
    <span class="title" v-text="title"></span>
    <a class="right" 
      href="javascript:;"
      v-if="rightText"
      v-html="rightText"
      @click="rightEvent">
    </a>
  </div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
            }
        },
        mounted (){
        },
        props: ['title', 'rightText','noLeft'],
        methods:{
            leftEvent : function(){
              if( this._events["left-event"]){
                this.$emit("left-event");
              }else{
                this.$router.go(-1);
                //window.history.back();
              }
            },
            rightEvent : function(){
              this.$emit("right-event");
            }
        }
    });
})
