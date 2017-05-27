define(function(require,exports,module){
"use strict";
var _template = `
<div class="weui-media-box weui-media-box_appmsg ks_list_item ks_list_item_findlist findgoods-list" @click="sendCount">
  <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg weui-media-box__bd ks_list_item_bd" @click="showDetail(listF)">
    <div class="weui-media-box__hd">
      <img class="weui-media-box__thumb" :src="listF.avatarUrl">
    </div>
    <div class="weui-media-box__bd h_60">
      <div class="weui-media-box__title address">
        <span class="address_name" v-text="listF.from"></span>
        <i class="icon_1 icon_1_find_arrow"></i>
        <span class="address_name" v-text="listF.to"></span>
      </div>
      <p class="weui-media-box__desc address_detail">
        <span class="address_detail_text" v-if="listF.cargoTypeName" v-text="listF.cargoTypeName"></span> 
        <span class="address_detail_text" v-if="listF.carType" v-text="listF.carType"></span> 
        <span class="address_detail_text" v-if="listF.carLen" v-text="listF.carLen"></span> 
        <!--<i class="icon_find_renzheng"></i>-->
      </p>
      <ul class="weui-media-box__info address_author">
          <li class="weui-media-box__info__meta" v-text="listF.userName"></li>
          <li class="weui-media-box__info__meta"
            v-if="listF.registerTimeDiff"
           v-text="listF.registerTimeDiff"></li>
          <li class="weui-media-box__info__meta weui-media-box__info__meta_extra" 
          v-if="listF.userName !== '恒丰物流'"
          v-text="'发货' + listF.sendCount + '条'"></li>
      </ul>
    </div>
  </a>
  <a  :href="'tel:'+listF.mobile[0]" class="weui-media-box weui-media-box_appmsg weui-media-box__ft ks_list_item_ft hide_before" @click="addContact(listF)">
    <ul class="weui-media-box__bd">
      <li class="find_phone">
          <i class="icon_1 icon_1_find_phone"></i>
      </li>
      <li class="address_time" v-text="listF.createTimeDiffShort"></li>
    </ul>
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
        props: ['listF'],
        methods: {
          showDetail: function(listF) {
            this.$emit('show-detail',listF)
          },
          sendCount : function(){
            var id = this.listF.id;
            if(!id) {
              console.error("点击统计ID错误", id);
              return;
            }
            var opts = {
              type: "GET",
              async: true,
              dataType: "json",
              url: window._G_.url.findgoods_post_browseCount,
              data: {
                'id' : id,
                't' : new Date().getTime()
              },
              success : function(res){
              },
              error : function(res){
                console.error("点击统计返回值错误",res);
              },
              complete : function(res){
              }
            };
            return $.ajax(opts);
          },
          addContact : function(listF){
            this.$emit('add-contact',listF)
          }
        }
    });
})
