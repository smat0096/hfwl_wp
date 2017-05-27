define(function(require,exports,module){
"use strict";
var _template = `
<div  class="picker-footer">
  <transition :name="transitionFade">
    <div class="floor_mask" v-show="isShow"></div>
  </transition>
  <transition :name="transitionSlideY">
    <div class="floor_content"  v-show="isShow">
        <div class="s_box">
            <div class="s_h" v-text="title">标题</div>
            <p class="c_o mb-10" 
              v-show="isShowValue" 
              v-text="valueText">结果</p>
            <p class="" 
              v-show="isShowCurrPath" 
              v-text="currPath"
            >路径</p>
            <p class=" clearfix" v-show="isShowBack && !picker.isTop">
              <a href="javascript:;" class="fr" @click='goPref'>返回上一级</a>
            </p>
            <ul class="s_list clearfix" :class="subClass">
              <li :class="value.active ? actClass : '' " v-for="(value,index) in curr.sub" @click="goSub(value)">
                <span v-text="value.name">吨</span>
              </li>
            </ul>
        </div>
        <div class="floor_close" @click = "hide" >确认</div>
        <div class="floor_close" @click = "reset" v-show="isShowReset">取消</div>
    </div>
  </transition>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              'transitionSlideY': 'slide-y',
              'transitionFade': 'transition-fade',
              'pref' : {},
              'curr' : {},
              'value' : [],
              'currPath' : '',
              'valueText' : '',
              'subClass' : '',
              'isShowBack' : false,
              'isShowValue' : false,
              'isShowCurrPath' : false,
              'isShowReset' : false,
              'actClass' : '',
              'title' : ''
            }
        },
        props: ['isShow','picker'],
        beforeUpdate : function () {
          if(!this.picker) return;
          var picker = this.picker;
          this.title = picker.opts.title;
          this.pref = picker.pref;
          this.curr = picker.curr;
          this.value = picker.value;
          this.currPath = picker.currPath;
          this.valueText = picker.valueText;
          
          /* 读取参数 */
          this.subClass = picker.opts.subClass;
          this.actClass = picker.opts.actClass;
          this.isShowBack = picker.opts.isShowBack;
          this.isShowValue = picker.opts.isShowValue;
          this.isShowCurrPath = picker.opts.isShowCurrPath;
          this.isShowReset = picker.opts.isShowReset;
        },
        computed:{
          driverCommentLength : function(){
            return this.driverComment.length;
          }
        },
        mounted: function(){
          this.initEvent();
        },
        methods: {
          "reset" : function(){
            var picker = this.picker;
            picker.reset();
            this.picker = picker;
            this.hide();
          },
          "hide": function(){
            var picker = this.picker;
            picker.goEnd();
            this.picker = picker;
          },
          "goSub" : function(data){
            var picker = this.picker;
            picker.goSub(data);
            this.pref = picker.pref;
            this.curr = {}; //注意次数需要重置响应;
            this.curr = picker.curr;
            this.value = picker.value;
            this.currPath = picker.currPath;
            this.valueText = picker.valueText;
          },
          "goPref" :function(){
            var picker = this.picker;
            picker.goPref();
            this.pref = picker.pref;
            this.curr = picker.curr;
            this.value = picker.value;
            this.currPath = picker.currPath;
            this.valueText = picker.valueText;
          },
          'setData' : function(value){
            console.log(value);
            //this.$emit('set-data',value);
          },
          'initEvent' : function(){
            
          },
         
        }
    });
})
