define(function(require,exports,module){
"use strict";
var _template = `
  <transition :name="transitionName">
    <div class="find_detail tab_box " v-show="isShowDetail">
      <div class="wrap">

        <div class="header_box">
          <header-back 
            title = "货源详情"
            v-on:left-event = "hideDetail"
          ></header-back>
        </div>

        <div class="content_box"> 
          <div class="find_goods_detail"> 
            <div class="consignor_box bc_o"> 
              <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg ks_list_item ks_list_item_detail">
                <div class="weui-media-box__hd">
                  <img class="weui-media-box__thumb" :src="listF.avatarUrl" />
                </div>
                <div class="weui-media-box__bd h_60">
                  <div class="weui-media-box__title address">
                    <span class="address_name" >{{ listF.from }}</span>
                    <i class="icon_1 icon_1_find_arrow"></i>
                    <span class="address_name">{{ listF.to }}</span>
                  </div>
                  <ul class="weui-media-box__info address_author">
                      <li class="weui-media-box__info__meta">{{ listF.userName }}</li>
                      <li class="weui-media-box__info__meta" v-if="listF.registerTimeDiff">{{ listF.registerTimeDiff }}</li>
                      <li class="weui-media-box__info__meta weui-media-box__info__meta_extra" 
                        v-if="listF.userName !== '恒丰物流'"
                      v-text="'发货' + listF.sendCount + '条'"></li>
                  </ul>
                </div>
              </a>

             <a href="javascript:void(0);" class="consignor_msg" @click="showMap(listF)">
              <div class="address_msg"> 
               <p class="c_o">{{ listF.content }}</p> 
              </div> 
              <p class="time_msg clearfix">
                <span>{{ listF.createTimeDiff }}</span> 来自 
                <span >{{ listF.companyName }}</span>
                <span class="c_o fr">
                  路线 <i class="icon_right bc_o"></i>
                </span>
              </p> 
             </a> 
             <div class="consignor_call"> 
              <div class="call_box"> 
               <div class="call_item" v-if="listF.mobile.length>0" v-for="detailTel in listF.mobile"> 
                  <div class="call_item_con  flex_box" style="justify-content:space-around">
                    <span class=" c_o">{{ detailTel }}</span> 
                    <a class="" :href="'tel:'+detailTel"  @click="addContact(listF)">
                      <i class="icon_1 icon_1_find_phone"></i> 
                    </a>
                  </div>
               </div> 
                <a class="call_item hide_tmp" href="javascript:;"> 
                  <div class="call_item_con clearfix text-center">
                    <span class="c_o fs-14"> 付信息费</span> 
                  </div>
                </a>
              </div>
             </div> 
            </div> 
          </div>
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
              'transitionName': 'in-out-translate-fade',
            }
        },
        props: ['isShowDetail','listF'],
        methods: {
          hideDetail: function() {
            this.$emit('hidedetail');
          },
          "showMap": function(listF){
            var opts;
            this.$store.commit('setMapType','route');
            if(listF.fromId && listF.toIds){
              opts = {
                start : {
                  cityCode : listF.fromId
                },
                end : {
                  cityCode : listF.toIds
                },
                dragable : false
              }
            }
            this.$store.commit('showMap',opts);
            //this.$emit('show-map',listF)
          },
          addContact : function(listF){
            this.$emit('add-contact',listF)
          }
        }
    });
})
