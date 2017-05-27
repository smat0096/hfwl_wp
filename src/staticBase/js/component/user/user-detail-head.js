define(function(require,exports,module){
"use strict";
var _template = `
<div class="weui-cells user-head">
  <div class="weui-media-box weui-media-box_appmsg weui-media-box__bd car-list_bd" @click="showDetail(listF)">
    <div class="weui-media-box__hd">
      <img class="weui-media-box__thumb" :src="listF.avatarUrl">
    </div>
    <div class="weui-media-box__bd">
      <div class="weui-media-box__title user_title">
        <span class="user_name" v-text="listF.userName"></span>
        <span>&nbsp;</span>
        <span>[{{ user.auditTypeName }}]</span>
        <span class="user_vip iblock" 
        :class="{'member_icon1' : listF.vipType ===0,'member_icon2':listF.vipType ===1}" v-show="listF.vipType !== null">
        </span>
      </div>
      <p class="weui-media-box__desc user_mobile">
        <span class="c_o" v-if="listF.mobile" v-text="listF.mobile">1397399****</span> 
      </p>
    </div>
    <a class="weui-media-box__hd  weui-cell_access weui-media-box__ft">
      <div>
        <span class="weui-cell__ft" v-text="user.auditStatusName">去认证</span>
      </div>      
    </a>
  </div>

</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              listF : ''
            }
        },
        props: ['user'],
        mounted: function(){
          this.listF = this.user.data;
        },
        methods: {
          showDetail : function(listF){
            this.$emit('audite');
          }
        }
    });
})
