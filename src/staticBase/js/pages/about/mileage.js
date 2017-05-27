define(function(require,exports,module){
   var _base = window._base,
      Picker = _base.picker,
      cityData = require('utils/kspicker/cityData.js');

var _template = `
<div class="wrap  transition-wrap" style="padding-bottom:50px" >
    <div class="wrap">
      <div class="header_box">

        <header-back 
          :title = "title"
        ></header-back>
        
      </div>
      
      <div class="content_box p_b-0">
        <div class="border_b_1">

          <!--表单 S-->
          <div class="weui-cells weui-cells_form">
            <!-- picker S -->

            <!-- 出发城市 -->
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">
                  出发地
                </label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" 
                  type="text" 
                  autocomplete="off"
                  placeholder="请选择地址" 
                  v-model="fromName"
                  name="fromName"
                  readonly
                  @click="showFromPicker"
                />
                <input class="weui-input" 
                  type="hidden" 
                  v-model="fromCode"
                  readonly
                  name="fromCode"
                />
              </div>
            </div>

            <!-- 目的城市 -->
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">
                  目的地
                </label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" 
                  type="text" 
                  autocomplete="off"
                  placeholder="请选择地址" 
                  v-model="toName"
                  name="toName"
                  readonly
                  @click="showToPicker"
                />
                <input class="weui-input" 
                  type="hidden" 
                  v-model="toCode"
                  readonly
                  name="toCode"
                />
              </div>
            </div>
            

            <!-- picker E -->
          </div>
          <!--表单 E-->

        </div>
        <div class="weui-btn-area mb-20">
          <a class="weui-btn weui-btn_primary orange_btn" href="javascript:;" ref="sender_submit" @click="showMap">计算距离</a>
        </div>
      </div>

    </div>

    <picker-footer
      v-bind:is-show="isShowPicker"
      v-bind:picker="picker" 
      v-on:hide="hidePicker"
    ></picker-footer>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              'title':'里程计算',
              'isShowPicker' : '',
              'picker' : '',
              'fromPicker' : '',
              'toPicker' : '',
              'fromName' : '',
              'fromCode' : '',
              'toName' : '',
              'toCode' : '',
            }
        },
        props: ['user'],
        mounted : function(){
          this.fromName = this.user.pos.cityName
        },
        methods: {
          /* picker S */
          "showFromPicker": function() {
            var _this = this;
            if(this.isReadonly) return;
            var  opts = {
              title : '请选择城市',
              'multiple' : 0,
              'subClass' : 'sub',
              'actClass' : 's',
              'isShowBack' : true,
              //'isShowValue' : true,
              'isShowCurrPath' : true,
              'length' : 2,
              data : cityData,
              extend : {
                afterSetCurr : function(picker){
                  //console.log('afterSetCurr',picker);
                },
                afterSetValue : function(picker){
                  //console.log('afterSetValue',picker);
                },
                afterPicker : function(picker){
                  var city = picker.valueText;
                  city = KsMap.fn.getCityByAddress(city);
                  _this.fromName = city;
                  _this.fromCode = KsMap.fn.getCityCodeByCity(city);
                  _this.hidePicker();
                }
              }
            };
            _this.fromPicker = _this.fromPicker || Picker(opts);
            _this.fromPicker.goTop();
            _this.picker = _this.fromPicker;
            this.isShowPicker = true;
          },
          "showToPicker": function() {
            var _this = this;
            if(this.isReadonly) return;
            var  opts = {
              title : '请选择城市',
              'multiple' : 0,
              'subClass' : 'sub',
              'actClass' : 's',
              'isShowBack' : true,
              'isShowCurrPath' : true,
              'length' : 2,
              data : cityData,
              extend : {
                afterPicker : function(picker){
                  var city = picker.valueText;
                  city = KsMap.fn.getCityByAddress(city);
                  _this.toName = city;
                  _this.toCode = KsMap.fn.getCityCodeByCity(city);
                  _this.hidePicker();
                }
              }
            };
            _this.toPicker = _this.toPicker || Picker(opts);
            _this.toPicker.goTop();
            _this.picker = _this.toPicker;
            this.isShowPicker = true;
          },
          "hidePicker": function(listF){
            this.isShowPicker = false;
          },
          showMap : function(){
            if(!this.fromName){
              $.toast('请选择出发地', 'cancel'); 
              return
            }
            if(!this.toName){
              $.toast('请选择目的地', 'cancel'); 
              return
            }

            this.$store.commit('setMapType','route');
            var opts = {
                start : {
                  cityName: this.fromName
                },
                end : {
                  cityName : this.toName
                },
                dragable : false
              }
            this.$store.commit('showMap',opts);
          }

          /* picker E */

        }
    });
  
})
