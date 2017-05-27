define(function(require,exports,module){
"use strict";
var headerChoosePlug = require('./header-choose_plug.js');
var headerChoosePlugInst;
var _template = `
<div id="js_city_plug_1" ref="js_city_plug">
  <div class="choose_panel">
    <ul>
      <li class="js_from_btn">
      <div class="p2">
        <div class="choose_area">
          <span class="js_c_txt">全国</span>
          <input type="hidden" value="-1" class="js_c_inp"/>
        </div>
        <i class="icon_list_down"></i>
      </div>
      </li>
      <li class="js_to_btn">
      <div class="p2">
        <div class="choose_area">
          <span class="js_c_txt">全国</span>
          <input type="hidden" value="-1" class="js_c_inp"/>
        </div>
        <i class="icon_list_down"></i>
      </div>
      </li>
      <li class="js_car_btn">
      <div class="p2">
        <div class="choose_area">
          <span class="js_c_txt">不限</span>
          <input type="hidden" value="不限" class="js_c_inp"/>
        </div>
        <i class="icon_list_down"></i>
      </div>
      </li>
    </ul>
  </div>
  <!--出发地-->
  <div class="slide_pop js_slide_pop js_from">
    <div class="city_box">
      <div class="city_info">
      <div class="js_city_txt">
        <p class="city_txt">选择省份：</p>
      </div>
      <div class="clearfix js_city_txt" style="display: none;">
        <p class="city_txt fl">当前所在省份：<span class="js_name"></span></p>
        <a href="javascript:;" class="fr city_txt js_back">返回上一级</a>
      </div>
      <table class="js_table"></table>
      </div>
    </div>
  </div>
  <!--到达地-->
  <div class="slide_pop js_slide_pop js_to">
    <div class="city_box">
      <div class="city_history js_history">
      <p class="city_txt">已选择到达地：</p>
      <ul class="city_h_list clearfix"></ul>
      </div>
      <div class="city_info">
      <div class="js_city_txt">
        <p class="city_txt">选择省份：</p>
      </div>
      <div class="clearfix js_city_txt" style="display: none;">
        <p class="city_txt fl">当前所在省份：<span class="js_name"></span></p>
        <a href="javascript:;" class="fr city_txt js_back">返回上一级</a>
      </div>
      <table class="js_table"></table>
      <p class="p_btn">
        <a href="javascript:;" class="btn js_confirm_btn">确定</a>
      </p>
      </div>
    </div>
  </div>
  <!--车长 车型-->
  <div class="slide_pop js_slide_pop js_car_info">
    <div class="s_box js_car_len">
      <div class="s_h">车长</div>
      <ul class="s_list clearfix">
      </ul>
    </div>
    <div class="s_box js_car_type">
      <div class="s_h" style="border-top:1px solid #dfdfdf;">车型</div>
      <ul class="s_list clearfix">
      </ul>
    </div>
    <p class="p_btn">
      <a href="javascript:;" class="btn js_confirm_car_btn">确定</a>
    </p>
  </div>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace: true,
        props: ['user'],
        data:function(){
            return{
            }
        },
        mounted: function(){
          this.initChoose(this.user);
        },
        beforeDestroy : function() {
          headerChoosePlugInst.destroy();
          headerChoosePlugInst = null;
        },
        methods:{
            initChoose : function(user){
              var _this = this;
              var callbackFn = function(data) {
                _this.$emit('choose-callback',data);
              };
              headerChoosePlugInst = headerChoosePlug.init({
                curFromId : user.pos.cityCode,
                curFromName : user.pos.cityName,
                plugBox: $(_this.$refs.js_city_plug),
                carCallBack: callbackFn,
                toCallBack: callbackFn,
                fromCallBack: callbackFn,
                fromAllWhole: 1
              });
              this.initData();
            },
            initData : function(){
              var _this = this;
              this.$emit('choose-callback',{
                from:{
                  'id' : _this.user.pos.cityCode,
                  'name' : _this.user.pos.cityName,
                },
                to:{
                  'id' : '-1',
                  'name' : '全国',
                },
                car:{
                  'len' : '不限',
                  'type' : '不限'
                }
              });
            }
        }
    });
})
