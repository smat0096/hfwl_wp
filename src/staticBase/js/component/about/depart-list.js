define(function(require,exports,module){
var _template = `
<div class="weui-cells depart-list bd_c">
  <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg weui-media-box__bd depart-list_bd" @click="showDetail(listF)">
    <div class="weui-media-box__hd">
      <img class="weui-media-box__thumb" :src="listF.avatarUrl">
    </div>
    <div class="weui-media-box__bd">
      <div class="weui-media-box__title depart_title flex_box flex_box-between">
        <div class="depart_name" v-text="listF.title">XX大型停车场</div> <!-- v-text="listF.userName" -->
        <div class="fs_08 hide">空位100个</div>
        <div class="fs_08 c_o" v-text="listF.ks_distance">距离: <span>21公里</span></div>
        <!--
        <span class="car_vip iblock" 
        :class="{'member_icon1' : listF.vipType ===0,'member_icon2':listF.vipType ===1}" v-show="listF.vipType !== null">
        </span>
        -->
      </div>
      <p class="weui-media-box__desc  flex_box flex_box-between">
        <span class="" v-if="listF.phoneNumber">电话: <span v-text="listF.phoneNumber">13888888888</span> </span>
        <span class="c_o hide" >优惠信息XXXXXXXXX</span> <!-- v-if="listF.mobile" -->
      </p>
      <ul class="weui-media-box__info car_map">
          <li class="weui-media-box__info__meta" v-if="listF.ks_address">地址: <span v-text="listF.ks_address">湖南郴州XXXXXXXXXXXXXXXXXXXXXXX</span></li>
      </ul>
    </div>
  </a>
  <div class="weui-cell weui-flex car-list_ft">
    <a href="javascript:void(0);" class="weui-flex__item weui-cell_access car-list_ft_item hide_border fs-14 c_o hide" >
      <i class="icon_1 icon_1_car_removed"></i>
      <span>详情</span>
    </a>
    <a href="javascript:void(0);" 
      class="weui-flex__item weui-cell_access car-list_ft_item fs-14 c_o"
      @click="showMap(listF)"
    >
      <i class="icon_1 icon_1_send_from"></i>
      <span>到这去</span>
    </a>
    <a  :href="'tel:'+listF.mobile" class="weui-flex__item weui-cell_access car-list_ft_item car-list_mobile fs-14 c_o" @click="addContact(listF)">
      <i class="icon_1 icon_1_smallphone"></i>
      <span>电话</span>
    </a>
  </div>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              isKnown : false
            }
        },
        props: ['listF'],
        methods: {
          showDetail: function(listF) {
            this.$emit('show-detail',listF)
          },
          "showMap": function(listF){
            var opts;
            this.$store.commit('setMapType','route');
            if(listF.userPoint && listF.point){
              opts = {
                start : {
                  point : listF.userPoint
                },
                end : {
                  point : listF.point
                },
                dragable : false
              }
              this.$store.commit('showMap',opts);
            }
          },
          addContact : function(listF){
            this.$emit('add-contact',listF)
          }
        }
    });
})
