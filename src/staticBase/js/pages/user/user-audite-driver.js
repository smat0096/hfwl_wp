define(function(require,exports,module){
  var cityData = require('utils/kspicker/cityData.js'),//重要 ,code 应为 string
      pickerData = require('commonUrl/staticTXT.js'),
      _user = require("./user-common.js");

var _template = `
<transition :name="transitionName">
<div class="wrap  transition-wrap  user-create-driver" style="padding-bottom:50px">
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
        <form  :action="formUrl" method="post" ref="driver_form"  enctype="multipart/form-data">
          <input type="hidden" name="formType" :value="formType" />

          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">姓名</label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="text" autocomplete="off" maxlength="6" placeholder="请输入姓名"
                v-model="listF.realName"
                name="realName"
                :readonly="isReadonly"
              />
            </div>
          </div>

          <div class="weui-cell">
            <div class="weui-cell__hd">
            <label class="weui-label">
              身份证号
            </label></div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="text" autocomplete="off"
                maxlength="19"
                minlength="15"
                placeholder="请输入身份证号码"
                v-model="listF.idCard"
                name="idCard"
                :readonly="isReadonly"
              />
            </div>
          </div>

          <!-- picker S -->

          <div class="weui-cell" id="">
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

          <div class="weui-cell" id="">
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

          <!-- picker E -->

          <div class="weui-cell">
            <div class="weui-cell__hd">
            <label class="weui-label">
              推荐人电话
            </label></div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="text" maxlength="11"
                placeholder="请输入推荐人电话"
                v-model="listF.businessMobile"
                name="businessMobile"
                :readonly="isReadonly"
              />
            </div>
          </div>

          <a class="weui-cell weui-cell_access weui-cell_image" href="javascript:;">
            <div class="weui-cell__hd"><label class="weui_label">驾驶证</label>
            </div>
            <div class="weui-cell__bd">
            </div>
            <div class="weui-cell__hd">
              <div :class= "driverLicenceInputClass">
                <input
                  v-if="!isReadonly"
                  ref="driverLicenceInput"
                  name="driverLicence"
                  class="weui-uploader__input"
                  type="file"
                  accept="image/*"
                >
                <img
                  ref="driverLicenceImage"
                  class="weui-uploader__file"
                  :src="listF.driverLicenceUrl"
                />
              </div>
            </div>
          </a>

          <a class="weui-cell weui-cell_access weui-cell_image" href="javascript:;">
            <div class="weui-cell__hd"><label class="weui_label">行驶证</label>
            </div>
            <div class="weui-cell__bd">
            </div>
            <div class="weui-cell__hd">
              <div :class= "drivingLicenceInputClass">
                <input
                  v-if="!isReadonly"
                  ref="drivingLicenceInput"
                  name="drivingLicence"
                  class="weui-uploader__input"
                  type="file"
                  accept="image/*"
                >
                <img
                  ref="drivingLicenceImage"
                  class="weui-uploader__file"
                  :src="listF.drivingLicenceUrl"
                />
              </div>
            </div>
          </a>


        </form>
        </div>
        <!--表单 E-->
      </div>

      <div class="weui-btn-area mb-20">
        <a class="weui-btn weui-btn_primary orange_btn" href="javascript:;" ref="driver_submit"  v-show="!isReadonly" @click="checkbusinessMobile" >确认提交</a> <!--  -->
      </div>

      <div class="weui-mask_transparent" v-show="isSubmiting"></div>
      <div class="weui-toast weui-toast--text weui-toast--visible" v-show="isSubmiting"><i class="weui-icon-success-no-circle weui-icon_toast"></i><p class="weui-toast_content">数据上传中,请稍候...</p></div>

    </div>

  </div>
  <picker-footer
    v-bind:is-show="isShowPicker"
    v-bind:picker="picker"
    v-on:hide="hidePicker"
  ></picker-footer>
</div>
</transition>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              'driverComment' : '',
              'isShowPicker' : '',
              'picker' : '',

              'cityPicker' : '',
              'plateTypePicker' : '',
              'plateNumberPicker' : '',
              'carTypePicker' : '',
              'carLenPicker' : '',

              'driverLicenceInputClass' : '',
              'drivingLicenceInputClass' : '',

              'listF':'',
              'title':'',
              'isReadonly':'',
              'formType':'',
              'formUrl':'',

              'ksvalidate' : '',
              'isSubmiting' : false
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
            var auditStatus = this.user.data.auditStatus;
            var auditType = this.user.data.auditType;
            if(this.user.isAudited){
              this.title = "查看认证信息";
              this.isReadonly = true;
              this.formType = 'viewDriver';
              this.formUrl = window._G_.url.user_view_driver;
            } else if( this.user.isVisitor ){
              this.title = "认证司机";
              this.isReadonly = false;
              this.formType = 'createDriver';
              this.formUrl = window._G_.url.user_create_driver;
            } else if( this.user.isDriver ){
              this.title = "认证司机";
              this.isReadonly = false;
              this.formType = 'editDriver';
              this.formUrl = window._G_.url.user_edit_driver;
            }else{
              console.error('数据错误',this.user)
            };
          },
          "showplateTypePicker": function() {
            var _this = this;
            if(this.isReadonly) return;
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
            if(this.isReadonly) return;
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
            if(this.isReadonly) return;
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
            if(this.isReadonly) return;
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
            this.initImage();
            if(this.isReadonly) return;
            _user.initUploadEvt.call(this,'driverLicence');
            _user.initUploadEvt.call(this,'drivingLicence');
            this.initValidate();
          },
          initImage : function(){
            this.listF.driverLicenceUrl ?  _user.uploadedImageInput.call(this,'driverLicence') : _user.resetImageInput.call(this,'driverLicence');
            this.listF.drivingLicenceUrl ?  _user.uploadedImageInput.call(this,'drivingLicence') : _user.resetImageInput.call(this,'drivingLicence');
          },
          initValidate : function(){
            _user.initValidate.call(this,this.$refs.driver_form,this.$refs.driver_submit);
          },
          checkbusinessMobile : function(){
            var _this = this;
            _user.checkWarningByAjax({
              mobile : _this.listF.businessMobile,
              errorMsg : "该业务员号码不存在,确定提交吗?"
            }, function(){
              _this.submit()
            });
          },
          submit : function(){
            if(this.isSubmiting) return;
            var _vm = this;
            var data = {
              realName : _vm.listF.realName
              ,idCard : _vm.listF.idCard
              ,plateType : _vm.listF.plateType
              ,plateNumber : _vm.listF.plateNumber
              ,driverLicence : _vm.listF.driverLicence
              ,drivingLicence : _vm.listF.drivingLicence
              ,businessMobile : _vm.listF.businessMobile
            };
            this.ksvalidate.submit(data,function(res){});
          },
          resetForm : function(){

          }

        }
    });
})
