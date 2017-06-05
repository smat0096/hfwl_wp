"use strict";
require('basicUrl/staticBase/css/home.css');
var template = `
<div class="wrap transition-wrap home" @click="invite">
  <div class="home_driver" v-if="user.isDriver">
    <div class="content_box" style="top:0;bottom:0;">
        <router-link to="/findGoodsS"  class="home_link_lt" alt="查看货源">
        </router-link>
        <router-link to="/userCommentCar"  class="home_link_lb" alt="发布车辆">
        </router-link>
        <router-link to="/findGoodsContact"  class="home_link_rt" alt="联系记录">
        </router-link>
        <router-link to="/userSetting"  class="home_link_rb" alt="用户中心">
        </router-link>
    </div>
  </div>
  <div class="home_sender" v-if="!user.isDriver">
    <div class="content_box" style="top:0;bottom:0;">
        <router-link to="/sendGoodsP"  class="home_link_lt" alt="发布货源">
        </router-link>
        <router-link to="/carportSource"  class="home_link_lb" alt="查看车辆">
        </router-link>
        <router-link to="/sendGoodsR"  class="home_link_rt" alt="发布记录">
        </router-link>
        <router-link to="/userSetting"  class="home_link_rb" alt="用户中心">
        </router-link>
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
      console.log(this.user)
      //$.alert("招商电话: 0735-8880606");
    }
  }
};
module.exports = Vue.extend(home);
