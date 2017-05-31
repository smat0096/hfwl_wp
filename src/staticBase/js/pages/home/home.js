define(function(require, exports, module) {
  "use strict";
var template = `
<div class="wrap  transition-wrap home">
  <div class="content_box bg_f0" style="top:0;">
    <div>
      <img src="`+window._G_.url.basicUrl+`/static/img/top.jpg" style="width:100%; display: block; max-height:'200px'" />
    </div>
    <div class="home_bd bg_f0" v-if="user.data.auditType != 1">
      <div class="h-200 flex_box mb-15">
        <router-link to="/sendGoods"  class="flex_item mr-15 bg_o flex_box flex_box-center">
          <div class="home_box-item">
            <div class="icon_1 icon_1_home_sendgoods"></div>
            <div class="home_box-item_text">发布货源</div>
          </div>
        </router-link>
        <div class="flex_item flex_box-column">
          <router-link to="/findGoodsS"  class="flex_item mb-15 flex_box flex_box-center" style="background-color: #f36676">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_findgoods"></div>
              <div class="home_box-item_text">查看货源</div>
            </div>
          </router-link>
          <router-link to="/carportSource"  class="flex_item flex_box flex_box-center" style="background-color: #ec940e">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_carportsource"></div>
              <div class="home_box-item_text">查看车源</div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="h-100 flex_box mb-15">
          <router-link to="/sendGoodsU"  class="flex_item mr-15 flex_box flex_box-center" style="background-color: #117ab3">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_sendgoodsU"></div>
              <div class="home_box-item_text">常发货源</div>
            </div>
          </router-link>
          <router-link to="/carportKnown"  class="flex_item flex_box flex_box-center" style="background-color: #f9644e">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_carportknown"></div>
              <div class="home_box-item_text">在线车库</div>
            </div>
          </router-link>
      </div>
      <div class="h-100 flex_box">
          <router-link to="/userSetting"  class="flex_item mr-15 flex_box flex_box-center" style="background-color: #55aba8">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_useraudite"></div>
              <div class="home_box-item_text">身份认证</div>
            </div>
          </router-link>
          <router-link to="/userCommentSelf" class="flex_item flex_box flex_box-center mr-15" style="background-color: #1e9e49" @click="invite">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_card"></div>
              <div class="home_box-item_text">物流名片</div>
            </div>
          </router-link>
          <router-link to="/aboutPage"  class="flex_item flex_box flex_box-center" style="background-color: #4971b6" @click="invite">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_about"></div>
              <div class="home_box-item_text">第三方工具</div>
            </div>
          </router-link>
      </div>
    </div>
    <div class="home_bd bg_f0" v-if="user.data.auditType == 1">
      <div class="h-200 flex_box mb-15">
        <router-link to="/findGoodsS"  class="flex_item mr-15 bg_o flex_box flex_box-center">
          <div class="home_box-item">
            <div class="icon_1 icon_1_home_findgoods"></div>
            <div class="home_box-item_text">查看货源</div>
          </div>
        </router-link>
        <div class="flex_item flex_box-column">
          <router-link to="/findGoodsContact"  class="flex_item mb-15 flex_box flex_box-center" style="background-color: #f36676">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_contact"></div>
              <div class="home_box-item_text">联系记录</div>
            </div>
          </router-link>
          <router-link to="/carportSource"  class="flex_item flex_box flex_box-center" style="background-color: #ec940e">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_carportsource"></div>
              <div class="home_box-item_text">查看车源</div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="h-200 flex_box">
        <div class="flex_item flex_box-column mr-15">
          <router-link to="/userCommentCar"  class="flex_item mb-15 flex_box flex_box-center" style="background-color: #117AB3">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_sendcars"></div>
              <div class="home_box-item_text">发布车辆</div>
            </div>
          </router-link>
          <router-link to="/userCommentSelf"  class="flex_item flex_box flex_box-center" style="background-color: #F9644E">
            <div class="home_box-item">
              <div class="icon_1 icon_1_home_card"></div>
              <div class="home_box-item_text">个人资料</div>
            </div>
          </router-link>
        </div>
        <router-link to="/aboutPage"  class="flex_item flex_box flex_box-center" style="background-color: #444D5C">
          <div class="home_box-item">
            <div class="icon_1 icon_1_home_about"></div>
            <div class="home_box-item_text">第三方工具</div>
          </div>
        </router-link>
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
    methods : {
      invite : function(){
        $.alert("招商电话: 0735-8880606");
      }
    }
  };
  home = Vue.extend(home);
  return home;

});
