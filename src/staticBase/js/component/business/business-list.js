define(function(require,exports,module){
"use strict";
var _template = `
<div class="weui-cells mt-10 user-head">
  <div class="weui-media-box weui-media-box_appmsg weui-media-box__bd car-list_bd" @click="showAuditeStatus()">
    <div class="weui-media-box__hd">
      <img class="weui-media-box__thumb" :src="listF.avatarUrl">
    </div>
    <div class="weui-media-box__bd h-60 flex_box-column flex_box-between">
      <div class="weui-media-box__title user_title">
        <span class="user_name" v-text="listF.userName"></span>
        <span>&nbsp;</span>
        <span>[{{ auditTypeName }}]</span>
        <span class="user_vip iblock hide" 
        :class="{'member_icon1' : listF.vipType ===0,'member_icon2':listF.vipType ===1}" v-show="listF.vipType !== null">
        </span>
      </div>
      <p class="weui-media-box__desc">
        <span v-if="listF.companyName" v-text="listF.companyName">公司名称</span> 
      </p>
      <p class="weui-media-box__desc">
        <span class="c_o" v-if="listF.mobile" v-text="listF.mobile">1397399****</span> 
        <span class="c_o" v-if="listF.createTimeDiffShort"> [{{ listF.createTimeDiffShort}}]</span> 
      </p>
    </div>
    <a class="weui-cell_access weui-media-box__ft" >
      <div>
        <span class="weui-cell__ft" v-text="auditStatusName">去认证</span>
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
              auditTypeName : '',
              auditStatusName : '',
            }
        },
        mounted: function(){
          var listF = _common.getAuditeStatus(this.listF);
          this.auditTypeName = listF.auditTypeName;
          this.auditStatusName = listF.auditStatusName;
        },
        props: ['listF'],
        methods: {
          showAuditeStatus : function(){
            return;
            var id = this.listF.userId;
            switch(Number(this.listF.auditType)){
              case window._G_.driver:
                this.$router.push({ name: 'businessAuditeDriver', params: { 'userId': id }})
                break;
              case window._G_.sender:
                this.$router.push({ path: 'businessAuditeSender', params: { userId: id }})
                break;
              case window._G_.business:
                break;
              case window._G_.factory:
                
                break;
              default :
                alert("用户未申请认证");
                break;
            }
          }


        }
    });
})
