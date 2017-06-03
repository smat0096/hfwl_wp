"use strict";
require('basicUrl/staticBase/css/home.css');
var template = `
<div class="wrap transition-wrap home">
  <div class="home_driver" v-if="user.data.auditType != 1">
    <img src="`+window._G_.url.publicPath+`/static/img/home/home_bg1.jpg"
      alt=""
      width="100%"
      height="100%"
      border="0"
      usemap="#home_driver_map"
      />
    <map name="home_driver_map" id="home_driver_map">
      <area shape="circle" coords="106,287,20" href ="venus.html" alt="查看货源" />
      <area shape="circle" coords="106,287,20" href ="mercur1.html" alt="发布车辆" />
      <area shape="circle" coords="106,287,20" href ="mercur2.html" alt="联系记录" />
      <area shape="circle" coords="106,287,20" href ="mercur3.html" alt="工具助手" />
    </map>
    <div class="home_bd ">
    </div>
  </div>
  <div class="home_bd" v-if="user.data.auditType == 1">
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
module.exports = Vue.extend(home);
