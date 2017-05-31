define(function(require,exports,module){
"use strict";
var _template = `
<div class="footer_nav" >
  <div class="footer_nav_mask" v-show="isShowSubNavIndex > 0" @click.stop="toggleSubNav(-1)">
  </div>
  <div class="weui-tabbar">
    <div  class="weui-tabbar__item" :class="{'weui-bar__item--on' : navIndex == 0}">
      <div @click.stop="toggleSubNav(0)">
        <router-link to="/home"  class="fsize">
          <!-- <span class="weui-badge" style="position: absolute;top: -.4em;right: 1em;">8</span> -->
          <div class="weui-tabbar__icon icon_1 icon_1_home">
            <!--<img src="./static/images/icon_nav_search_bar.png" alt="">-->
          </div>
          <p class="weui-tabbar__label">主页</p>
        </router-link>
      </div>
      <!--
      <transition :name="transitionSubNav">
        <div class="weui-tabbar__item_sub" v-show="isShowSubNavIndex == 0" @click.stop="toggleSubNav(-1)">
          <div class="sub_list" >
            <router-link to="/home"  class="fsize">主页</router-link>
          </div>
        </div>
      </transition>
      -->
    </div>
    <div  class="weui-tabbar__item" :class="{'weui-bar__item--on' : navIndex == 1}"  v-if="!(user.isSender || user.isFactory)"><!--/*TODEV*/-->
      <div @click.stop="toggleSubNav(1)">
        <!-- <span class="weui-badge" style="position: absolute;top: -.4em;right: 1em;">8</span> -->
        <div class="weui-tabbar__icon icon_1 icon_1_find">
        </div>
        <p class="weui-tabbar__label">找货</p>
      </div>
      <transition :name="transitionSubNav">
        <div class="weui-tabbar__item_sub" v-show="isShowSubNavIndex == 1" @click.stop="toggleSubNav(-1)">
          <div class="sub_list" >
            <router-link to="/findGoodsS"  class="fsize">查看货源</router-link>
          </div>
          <div class="sub_list" v-if="user.isDriver">
            <router-link to="/findGoodsContact" class="fsize">联系货源</router-link>
          </div>
        </div>
      </transition>
    </div>
    <div class="weui-tabbar__item" :class="{'weui-bar__item--on' : navIndex == 2}" v-if="user.isSender || user.isFactory"> <!--/*TODEV*/ -->
      <div @click.stop="toggleSubNav(2)">
        <div class="weui-tabbar__icon icon_1 icon_1_send">
        </div>
        <p class="weui-tabbar__label">发货</p>
      </div>
      <transition :name="transitionSubNav">
        <div class="weui-tabbar__item_sub" v-show="isShowSubNavIndex == 2"  @click.stop="toggleSubNav(-1)">
          <div class="sub_list">
            <router-link to="/sendGoodsP" class="fsize">发布货源</router-link>
          </div>
          <div class="sub_list">
            <router-link to="/sendGoodsU" class="fsize">常发货源</router-link>
          </div>
          <div class="sub_list">
            <router-link to="/sendGoodsR" class="fsize">发布记录</router-link>
          </div>
          <div class="sub_list">
            <router-link to="/sendGoodsL" class="fsize hide">运单</router-link>
          </div>
        </div>
      </transition>
    </div>
    <div class="weui-tabbar__item" :class="{'weui-bar__item--on' : navIndex == 3}">
      <div @click.stop="toggleSubNav(3)">
        <div class="weui-tabbar__icon icon_1 icon_1_carport">
        </div>
        <p class="weui-tabbar__label">车库</p>
      </div>
      <transition :name="transitionSubNav">
        <div class="weui-tabbar__item_sub" v-show="isShowSubNavIndex == 3" @click.stop="toggleSubNav(-1)">
          <div class="sub_list">
            <router-link to="/carportSource" class="fsize">查看车源</router-link>
          </div>
          <div class="sub_list" v-if="user.isSender || user.isFactory">
            <router-link to="/carportKnown" class="fsize" >熟车</router-link>
          </div>
          <div class="sub_list" v-if="user.isSender || user.isFactory">
            <router-link to="/carportContact" class="fsize" >联系记录</router-link>
          </div>
          <div class="sub_list" v-if="user.isDriver">
            <router-link to="/userCommentCar" class="fsize" >发布车辆</router-link>
          </div>
        </div>
      </transition>
    </div>
    <div class="weui-tabbar__item" :class="{'weui-bar__item--on' : navIndex == 4}">
      <div @click.stop="toggleSubNav(4)">
        <div class="weui-tabbar__icon icon_1 icon_1_user">
        </div>
        <p class="weui-tabbar__label">用户中心</p>
      </div>
      <transition :name="transitionSubNav">
        <div class="weui-tabbar__item_sub" v-show="isShowSubNavIndex == 4" @click.stop="toggleSubNav(-1)">
          <div class="sub_list">
            <router-link to="/userSetting" class="fsize">用户中心</router-link>
          </div>
          <div class="sub_list" >
            <router-link to="/userCommentSelf" class="fsize" >联系方式</router-link>
          </div>
          <div class="sub_list" v-if="user.isBusiness" >
            <router-link to="/businessR" class="fsize" >我的推荐</router-link>
          </div>
        </div>
      </transition>
    </div>
  </div>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
                'transitionSubNav' : "transition-scale-fade",
                'isShowSubNavIndex' : -1,
            }
        },
        props : ['user'],
        mounted: function(){
        },
        computed : {
          navIndex : function(){
            var index,
                path = this.$route.path;
            switch(path){
              case '/home':
                index = 0;
                break;
              case '/findGoodsS':
              case '/findGoodsContact':
                index = 1;
                break;
              case '/sendGoodsP':
              case '/sendGoodsR':
              case '/sendGoodsU':
              case '/sendGoodsL':
                index = 2;
                break;
              case '/carportKnown':
              case '/carportAdd':
              case '/carportSource':
              case '/carportContact':
              case '/userCommentCar': //发布车辆
                index = 3;
                break;
              case '/userSetting':
              case '/userAuditeDriver':
              case '/userAuditeSender':
              case '/userCommentSelf':
              case '/businessR':
                index = 4;
                break;
              default:
                index = -1;
                break;
            }
            return index;
          }
        },
        methods:{
            toggleSubNav : function(subIndex){
              this.isShowSubNavIndex = this.isShowSubNavIndex == subIndex ? -1 : subIndex;
            }
        }
    });
})
