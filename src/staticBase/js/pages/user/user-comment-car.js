define(function(require,exports,module){
  var cityData = require('utils/kspicker/cityData.js'),//重要 ,code 应为 string
      pickerData = require('commonUrl/staticTXT.js'),
      _user = require("./user-common.js");

    //旧地址插件
var kscitychoose = require('utils/kscitychoose/ks_city_choose.js');
  /*
    cityData.map(function(province){
      province.sub && province.sub.map(function(city){
        if(city.sub && city.sub.length === 1) return city;
        city.sub && city.sub.unshift({
        "name": "全"+city.name,
        "code": city.code,
        "include": "current"
        })
        return city;
      });
      if(province.sub && province.sub.length === 1) return province;
      province.sub && province.sub.unshift({
        "name": "全"+province.name,
        "code": province.code,
        "include": "current"
      });
      return province;
    })
    cityData.unshift({
      "name": "全国",
      "code": "-1",
      "include": "all"
    });
  */
var _template = `
<transition :name="transitionName">
<div class="wrap  transition-wrap  user-comment-driver" style="padding-bottom:50px">
  <div class="wrap">

    <div class="header_box">
      <header-back
        :title = "title"
      ></header-back>
    </div>

    <div class="content_box p_b-0">
      <div class="border_b_1 mg_t-30">
        <!--表单 S-->
        <div class="weui-cells weui-cells_form">
        <form :action="formUrl" method="post" ref="car_form"  enctype="multipart/form-data">
          <input type="hidden" name="formType" :value="formType" />
          <!-- picker S -->

          <!-- 城市 -->
          <div class="weui-cell" ><!-- 自写多选插件 @click="showCityPicker" -->
            <div class="weui-cell__hd">
              <label class="weui-label">
                期望目的地
              </label>
            </div>
            <ul class="weui-cell__bd">
              <li class="js_city_btn">
                <div class="p2">
                  <div class="">
                    <span class="js_c_txt" v-text="listF.destinationsName">全国</span>
                    <input type="hidden" v-model="listF.destinationsName" class="js_city_name_inp" name="destinationsName"/>
                    <input type="hidden" v-model="listF.destinationsCode" class="js_city_code_inp" name="destinationsCode"/>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="weui-cell" >
            <div class="weui-cell__hd">
              <label class="weui-label">
                车牌类型
              </label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input"
                type="text"
                autocomplete="off"
                placeholder="请选择车牌类型"
                v-model="listF.plateType"
                readonly
                name="plateType"
                @click="showplateTypePicker"
              />
            </div>
          </div>

          <div class="weui-cell" >
            <div class="weui-cell__hd">
              <label class="weui-label">
                车牌号码
              </label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input"
                type="text"
                autocomplete="off"
                placeholder="请选择车牌号码"
                v-model="listF.plateNumber"
                readonly
                name="plateNumber"
                @click="showplateNumberPicker"
              />
            </div>
          </div>

          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">
                车型
              </label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input"
                type="text"
                autocomplete="off"
                placeholder="请选择车型"
                v-model="listF.carType"
                readonly
                name="carType"
                @click="showCarTypePicker"
              />
            </div>
          </div>

          <div class="weui-cell" >
            <div class="weui-cell__hd">
              <label class="weui-label">
                车长
              </label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input"
                type="text"
                autocomplete="off"
                placeholder="请选择车长"
                v-model="listF.carLen"
                readonly
                name="carLen"
                @click="showCarLenPicker"
              />
            </div>
          </div>

          <!-- picker E -->

          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">
                载重
              </label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input"
                type="text"
                autocomplete="off"
                placeholder="请输入载重"
                v-model="listF.loadNum"
                name="loadNum"
              />
            </div>
            <div class="weui-cell__ft fs-in">
              <label class="weui-label">
                吨
              </label>
            </div>
          </div>

        </form>
        </div>
        <!--表单 E-->
      </div>
      <div class="weui-btn-area mb-20">
        <a class="weui-btn weui-btn_primary orange_btn" href="javascript:;" ref="car_submit">确认提交</a>
      </div>
    </div>

  </div>
  <picker-footer
    v-bind:is-show="isShowPicker"
    v-bind:picker="picker"
    v-on:hide="hidePicker"
  ></picker-footer>

  <!--旧cityPicker插件 -->
  <div class="slide_pop js_slide_pop js_city_box fsize-fixed">
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
</div>
</transition>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              'transitionName' : 'in-out-translate',
              'driverComment' : '',
              'isShowPicker' : '',
              'picker' : '',
              'cityPicker' : '',
              'plateTypePicker' : '',
              'plateNumberPicker' : '',
              'carTypePicker' : '',
              'carLenPicker' : '',

              'avatarInputClass' : '',
              'avatarImageUrl' : '',

              'listF':'',
              'title':'',
              'formType':'editCar',
              'formUrl':window._G_.url.user_edit_car,

              'isSubmiting' : false,
              'ksvalidate' : ''
            }
        },
        props: ['user'],
        mounted: function(){
          this.initData();
          this.initEvent();
        },
        methods: {
          "initData": function(){
            this.listF = this.user.data;
            if(this.user.isDriver){
              this.title = "发布车源信息";
              this.formType = 'editCar';
              this.formUrl = window._G_.url.user_edit_car;
              this.listF.destinationsName = this.listF.destinationsName || '全国';
              this.listF.destinationsCode = this.listF.destinationsCode || '-1';
            } else{
              console.error("用户类型错误");
              alert("用户类型错误");
            };
          },
          /* picker S */
          "initOldCityPicker": function() {
            var _this = this;
            var callbackFn = function(data) {
              _this.listF.destinationsCode = [].join.call(data.city.id,',');
              _this.listF.destinationsName = [].join.call(data.city.name,',');
              //_this.$emit('choose-callback',data);
            };
            kscitychoose.init({
              //curFromId : user.pos.cityCode,
              //curFromName : user.pos.cityName,
              cityCallBack: callbackFn
              ,plugBox : $(".user-comment-driver")
            });
          },
          "showCityPicker": function() {
            var _this = this;
            var  opts = {
              title : '请选择城市',
              'multiple' : 0,
              'subClass' : 'sub',
              'actClass' : 's',
              'multiple' : 4,
              'isShowBack' : true,
              'isShowReset' : true,
              'isShowValue' : true,
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
                  _this.listF.destinationsName = city.replace(/全(?!国)[^,\b\s]+?(\,|\b|\s|$)/g,function(){
                    //console.log(arguments);
                    return arguments[1];
                  });
                  _this.listF.destinationsCode = picker.valueCode.join(',');
                  _this.hidePicker();
                }
              }
            };
            _this.cityPicker = _this.cityPicker || Picker(opts);
            _this.cityPicker.goTop();
            _this.picker = _this.cityPicker;
            this.isShowPicker = true;
          },

          "showplateTypePicker": function() {
            var _this = this;
            var  opts = {
              title : '请选择车牌类型',
              'actClass' : 's',
              data : ['蓝色车牌','黄色车牌'],
              extend : {
                afterPicker : function(picker){
                  _this.listF.plateType = picker.valueText;
                  _this.hidePicker();
                }
              }
            };
            _this.plateTypePicker = _this.plateTypePicker || Picker(opts);
            _this.picker = _this.plateTypePicker;
            this.isShowPicker = true;
          },
          "showplateNumberPicker": function() {
            var _this = this;
            var  opts = {
              title : '请选择车牌号码',
              'actClass' : 's',
              'subClass' : 'sub sub_5',
              'topSign' : '',
              'valueSign' : '',
              'type' : 'para',
              'isShowValue' : true,
              //'isShowCurrPath' : true,
              data : pickerData.carNumber,
              extend : {
                afterPicker : function(picker){
                  _this.listF.plateNumber = picker.valueText;
                  _this.hidePicker();
                }
              }
            };
            _this.plateNumberPicker = _this.plateNumberPicker || Picker(opts);
            _this.plateNumberPicker.reset();
            _this.picker = _this.plateNumberPicker;
            this.isShowPicker = true;
          },
          "showCarTypePicker": function() {
            var _this = this;
            var  opts = {
              title : '请选择车辆类型',
              'actClass' : 's',
              data : pickerData.VEHICLE_TYPES,
              extend : {
                afterPicker : function(picker){
                  _this.listF.carType = picker.valueText;
                  _this.hidePicker();
                }
              }
            };
            _this.carTypePicker = _this.carTypePicker || Picker(opts);
            _this.picker = _this.carTypePicker;
            this.isShowPicker = true;
          },
          "showCarLenPicker": function() {
            var _this = this;
            var  opts = {
              title : '请选择车辆长度',
              'actClass' : 's',
              data : pickerData.VEHICLE_LENGTHS,
              extend : {
                afterPicker : function(picker){
                  _this.listF.carLen = picker.valueText;
                  _this.hidePicker();
                }
              }
            };
            _this.carLenPicker = _this.carLenPicker || Picker(opts);
            _this.picker = _this.carLenPicker;
            this.isShowPicker = true;
          },

          "hidePicker": function(listF){
            this.isShowPicker = false;
            this.pickerOptions = null;
          },

          /* picker E */

          'initEvent' : function(){
            this.initValidate();
            this.initOldCityPicker();
          },
          initValidate : function(){
            _user.initValidate.call(this,this.$refs.car_form,this.$refs.car_submit,true);
          }

        }
    });
})
