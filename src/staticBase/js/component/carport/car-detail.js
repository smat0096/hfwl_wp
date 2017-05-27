define(function(require,exports,module){
"use strict";
var carList = require('./car-list.js');
var _template = `
  <transition :name="transitionName">
    <div class="car_detail tab_box " v-show="isShowDetail">
      <div class="wrap">
        <div class="header_box">
          <header-back 
            title = "车源详情"
            v-on:left-event = "hideDetail"
          ></header-back>
        </div>

        <div class="content_box"> 
          <!-- car_list S -->
          <car-list
            v-bind:list-f="listF" 
            v-on:show-detail="showDetail"
            v-on:add-known="addKnown"
            v-on:remove-known="removeKnown"
            v-on:add-contact="addContact"
          ></car-list>
          <!-- car_list E -->

          <!--司机信息 S-->
          <div class="weui-cells car-details">
            <div class="weui-cell" v-if="listF.carType">
              <div class="weui-cell__bd car-cell_bd">
                <p>车辆类型</p>
              </div>
              <div class="weui-cell__ft car-cell_ft">{{ listF.carType }}</div>
            </div>
            <div class="weui-cell" v-if="listF.trailerAxleType">
              <div class="weui-cell__bd car-cell_bd">
                <p>拖运类型</p>
              </div>
              <div class="weui-cell__ft car-cell_ft">{{ listF.trailerAxleType }}</div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd car-cell_bd">
                <p>期望地点</p>
              </div>
              <div class="weui-cell__ft car-cell_ft">{{ listF.destinationsName }}</div>
            </div>

            <div class="weui-cell weui-cells_form">
              <div class="weui-cell__bd">
                <textarea
                  id="car_detail_comment"
                  :readonly="isReadonly"
                  class="weui-textarea" 
                  placeholder="请输入备注信息" 
                  rows="3"
                  maxlength="60"
                  v-model = "listF.comment"
                  ></textarea>
                <div class="weui-textarea-counter">
                  <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary orange_btn"
                   @click="editToggle"
                  >
                    <span v-show="isReadonly">编辑备注</span>
                    <span v-show="!isReadonly">确认提交</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
          <!--司机信息 E-->
          
          <div class="weui-cells">
            <div class="weui-cell">
              <div class="weui-cell__bd car-cell_bd">
                <p>最近定位时间</p>
              </div>
              <div class="weui-cell__ft car-cell_ft">定位地点</div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd car-cell_bd">
                <p>{{ listF.lastLocateTimeDiff }}</p>
              </div>
              <div class="weui-cell__ft car-cell_ft">{{ listF.lastAddress }}</div>
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
              'isReadonly' : true
            }
        },
        props: ['isShowDetail','listF'],
        components: {
          'car-list': carList
        },
        methods: {
          showDetail : function(){
            
          },
          hideDetail: function() {
            this.isReadonly = true;
            this.$emit('hidedetail');
          },
          "addKnown" :function(listF){
            this.$emit('add-known',listF)
          },
          "removeKnown" :function(listF){
            this.isReadonly = true;
            this.$emit('remove-known',listF)
          },
          "editToggle": function(){
            if(this.isReadonly){
              this.editOn(this.listF)
            }else{
              this.editOff(this.listF)
            }
          },
          "editOn" : function(){
            if(!this.listF.isKnown){
              $.toast('需要添加熟车才能编辑备注信息!',"text"); 
              return;
            }
            this.isReadonly = false;
          },
          "editOff" : function(){
            this.isReadonly = true;
            var comment_text = $("#car_detail_comment").val();
            this.$emit('post-comment',this.listF)
          },
          addContact : function(listF){
            this.$emit('add-contact',listF)
          }
        }
    });
})
