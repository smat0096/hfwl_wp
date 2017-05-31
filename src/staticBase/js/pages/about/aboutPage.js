define(function(require, exports, module) {
  "use strict";

var template = `
<div class="wrap  transition-wrap home">
  <div class="content_box bg_f0" style="top:0;">
    <div>
      <img src="`+window._G_.url.basicUrl+`/static/img/top.jpg" style="width:100%; display: block; max-height:'200px'" />
    </div>
    <div class="home_bd bg_f0">
      <div class="h-200 flex_box mb-15">
        <router-link to="/depart" class="flex_item mr-15 flex_box flex_box-center" style="background-color: #117ab3">
          <div class="home_box-item">
            <div class="icon_1 icon_1_home_sendgoods"></div>
            <div class="home_box-item_text">附近停车场</div>
          </div>
        </router-link>
        <div class="flex_item flex_box-column">
        <!-- href="http://tools.2345.com/m/jiaotong/lc-luxian.htm" -->
          <router-link to="/mileage"  class="flex_item mb-15 flex_box flex_box-center" style="background-color: #ec940e">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_sendgoodsU"></div>
              <div class="home_box-item_text">里程计算</div>
            </div>
          </router-link>
          <a href="http://mid.weixingmap.com/main.htm"  class="flex_item flex_box flex_box-center" style="background-color: #1e9e49">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_card"></div>
              <div class="home_box-item_text">身份证验证</div>
              
            </div>
          </a>
        </div>
      </div>
      <div class="h-100 flex_box mb-15">
          <a href="javascript:;" class="flex_item flex_box flex_box-center mr-15" style="background-color: #1e9e49" @click="toFixed"><!-- http://m.ylqlife.cn/ -->
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_hyx"></div>
              <div class="home_box-item_text">车险计算</div>
            </div>
          </a>

          <a href="javascript:;"  class="flex_item mr-15 flex_box flex_box-center" style="background-color: #4971b6" @click="toFixed"> <!--http://tools.2345.com/m/weizhang.htm-->
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_findgoods"></div>
              <div class="home_box-item_text">查违章</div>
            </div>
          </a>
          <a href="javascript:;"   class="flex_item  flex_box flex_box-center" style="background-color: #55aba8"  @click="toFixed"><!--http://tools.2345.com/m/carlist.htm-->
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_sendcars"></div>
              <div class="home_box-item_text">查车牌号</div>
            </div>
          </a>
      </div>
      <div class="h-100 flex_box">
          <a href="javascript:;" class="flex_item flex_box flex_box-center" style="background-color: #f36676" @click="invite">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_zhaoshang"></div>
              <div class="home_box-item_text">广告招商</div>
            </div>
          </a>
      </div>
    </div>
  </div>
</div>
`;

  var home = {
    template : template,
    data: function(){
      return {
      }
    },
    props : ['user'],
    mounted : function(){
    },
    methods : {
      invite : function(){
        $.alert("招商电话: 0735-8880606");
        return false;
      },
      toFixed : function(){
        $.alert("功能完善中,招商电话: 0735-8880606");
        return false;
      }
    }
  };
  home = Vue.extend(home);
  return home;

});
