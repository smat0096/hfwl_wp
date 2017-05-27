define(function(require,exports,module){
var _template = `
<div class="weui-cells car-list bd_c">
  <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg weui-media-box__bd car-list_bd" @click="showDetail(listF)">
    <div class="weui-media-box__hd">
      <img class="weui-media-box__thumb" :src="listF.avatarUrl">
    </div>
    <div class="weui-media-box__bd">
      <div class="weui-media-box__title car_title">
        <span class="car_name" v-text="listF.userName"></span>
        <span>&nbsp;</span>
        <!--
        <span class="car_vip iblock" 
        :class="{'member_icon1' : listF.vipType ===0,'member_icon2':listF.vipType ===1}" v-show="listF.vipType !== null">
        </span>
        -->
      </div>
      <p class="weui-media-box__desc car_type">
        <span class="c_o" v-if="listF.plateNumber" v-text="listF.plateNumber"></span> 
        <span class="c_o" v-if="listF.carType" v-text="listF.carType"></span> 
        <span class="c_o" v-if="listF.carLen" v-text="listF.carLen+'米'"></span> 
      </p>
      <ul class="weui-media-box__info car_map">
          <li class="weui-media-box__info__meta" v-text="listF.lastLocateTimeDiff"></li>
          <li class="weui-media-box__info__meta" v-text="listF.lastAddressDiff"></li>
          <li class="weui-media-box__info__meta weui-media-box__info__meta_extra" 
          v-text="listF.distance"></li>
      </ul>
    </div>
  </a>
  <div class="weui-cell weui-flex car-list_ft">
    <a href="javascript:void(0);" class="weui-flex__item weui-cell_access car-list_ft_item hide_border fs-14 c_o" @click="addKnown(listF)" v-show="!listF.isKnown">
      <i class="icon_1 icon_1_car_removed"></i>
      <span>熟车</span>
    </a>
    <a href="javascript:void(0);" class="weui-flex__item weui-cell_access car-list_ft_item hide_border fs-14 c_o" @click="removeKnown(listF)" v-show="listF.isKnown">
      <i class="icon_1 icon_1_car_added"></i>
      <span>熟车</span>
    </a>
    <a href="javascript:void(0);" 
      class="weui-flex__item weui-cell_access car-list_ft_item fs-14 c_o"
      @click="showMap(listF)"
    >
      <i class="icon_1 icon_1_send_from"></i>
      <span>定位</span>
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
            var opts = KsMap.fn.makePoint(listF);
            this.$store.commit('setMapType','car');
            this.$store.commit('showMap',opts);
            var message = '';
            if(listF.lastAddress){
              message = '最近定位位置为: ' + listF.lastAddress;
            }
            this.$store.commit('setMessage',message);
          },
          addKnown : function(listF){
            this.$emit('add-known',listF)
          },
          removeKnown : function(listF){
            this.$emit('remove-known',listF)
          },
          addContact : function(listF){
            this.$emit('add-contact',listF)
          }
        }
    });
})
