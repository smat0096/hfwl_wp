define(function(require,exports,module){
  var cityData = require('utils/kspicker/cityData.js'),//重要 ,code 应为 string
      pickerData = require('commonUrl/staticTXT.js'),
      _user = require("./user-common.js");


var _template = `
<transition :name="transitionName">
<div class="wrap  transition-wrap  user-create-sender" style="padding-bottom:50px" >
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
        <form  :action="formUrl" method="post"  ref="sender_form"  enctype="multipart/form-data">
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
          <!-- 城市 -->
          <div class="weui-cell" id="">
            <div class="weui-cell__hd">
              <label class="weui-label">
                所在城市
              </label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input"
                type="text"
                autocomplete="off"
                placeholder="请选择地址"
                v-model="listF.city"
                readonly
                name="city"
                @click="showCityPicker"
              />
              <input class="weui-input"
                type="hidden"
                v-model="listF.cityCode"
                readonly
                name="cityCode"
              />
            </div>
          </div>

          <!-- picker E -->

          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">
                公司名称
              </label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input"
                type="text"
                autocomplete="off"
                placeholder="请输入公司名称"
                v-model="listF.companyName"
                name="companyName"
                :readonly="isReadonly"
              />
            </div>
          </div>

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
            <div class="weui-cell__hd"><label class="weui_label">身份验证</label>
            </div>
            <div class="weui-cell__bd pd-0_20">
              <span v-show ="!isReadonly">请上传手持身份证认证照片</span>
            </div>
            <div class="weui-cell__hd">
              <div :class= "idAuthInputClass">
                <input
                  v-if ="!isReadonly"
                  ref="idAuthInput"
                  name="idAuth"
                  class="weui-uploader__input"
                  type="file"
                  accept="image/*"
                >
                <img
                  ref="idAuthImage"
                  class="weui-uploader__file"
                  :src="listF.idAuthUrl"
                />
              </div>
            </div>
          </a>

          <a class="weui-cell weui-cell_access weui-cell_image" href="javascript:;">
            <div class="weui-cell__hd"><label class="weui_label">门店照</label>
            </div>
            <div class="weui-cell__bd">
            </div>
            <div class="weui-cell__hd">
              <div :class= "storeInputClass">
                <input
                  v-if ="!isReadonly"
                  ref="storeInput"
                  name="store"
                  class="weui-uploader__input"
                  type="file"
                  accept="image/*"
                >
                <img
                  ref="storeImage"
                  class="weui-uploader__file"
                  :src="listF.storeUrl"
                />
              </div>
            </div>
          </a>

          <a class="weui-cell weui-cell_access weui-cell_image" href="javascript:;">
            <div class="weui-cell__hd"><label class="weui_label">营业执照</label>
            </div>
            <div class="weui-cell__bd">
            </div>
            <div class="weui-cell__hd">
              <div :class= "businessLicenseInputClass">
                <input
                  v-if ="!isReadonly"
                  ref="businessLicenseInput"
                  name="businessLicense"
                  class="weui-uploader__input"
                  type="file"
                  accept="image/*"
                >
                <img
                  ref="businessLicenseImage"
                  class="weui-uploader__file"
                  :src="listF.businessLicenseUrl"
                />
              </div>
            </div>
          </a>


        </form>
        </div>
        <!--表单 E-->
      </div>
      <div class="weui-btn-area mb-20">
        <a class="weui-btn weui-btn_primary orange_btn" href="javascript:;" ref="sender_submit" v-show="!isReadonly" @click="checkbusinessMobile">确认提交</a>
      </div>
    </div>

    <div class="weui-mask_transparent" v-show="isSubmiting"></div>
    <div class="weui-toast weui-toast--text weui-toast--visible" v-show="isSubmiting"><i class="weui-icon-success-no-circle weui-icon_toast"></i><p class="weui-toast_content">数据上传中,请稍候...</p></div>

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
              'isShowPicker' : '',
              'picker' : '',
              'cityPicker' : '',

              'idAuthInputClass' : '',
              'storeInputClass' : '',
              'businessLicenseInputClass' : '',

              'listF':'',
              'title':'',
              'isReadonly':'',
              'formType':'',
              'formUrl':'',

              'isSubmiting' : false,
              'ksvalidate' : '',
              'transitionName' : 'in-out-translate',
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
              //因厂家和货主信息界面为共用, TOFIXED
              this.title = "查看认证信息";
              this.isReadonly = true;
              this.formType = 'viewSender';
              this.formUrl = window._G_.url.user_view_sender;
            }else if( this.user.isVisitor){
              this.title = "认证货主";
              this.isReadonly = false;
              this.formType = 'createSender';
              this.formUrl = window._G_.url.user_create_sender;
            }else if( this.user.isSender){
              this.title = "认证货主";
              this.isReadonly = false;
              this.formType = 'editSender';
              this.formUrl = window._G_.url.user_edit_sender;
            }else if( this.user.isFactory ){
              this.title = "认证厂家";
              this.isReadonly = false;
              this.formType = 'editFactory';
              this.formUrl = window._G_.url.user_edit_factory;
            }else{
              alert("用户类型错误");
              console.error("用户类型错误");
            };
          },

          /* picker S */
          "showCityPicker": function() {
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
                  _this.listF.city = city;
                  _this.listF.cityCode = KsMap.fn.getCityCodeByCity(city);
                  _this.hidePicker();
                }
              }
            };
            _this.cityPicker = _this.cityPicker || Picker(opts);
            _this.cityPicker.goTop();
            _this.picker = _this.cityPicker;
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
            _user.initUploadEvt.call(this,'idAuth');
            _user.initUploadEvt.call(this,'store');
            _user.initUploadEvt.call(this,'businessLicense');
            this.initValidate();
          },
          /* 图片重置 S */
          initImage : function(){
            this.listF.idAuthUrl ?  _user.uploadedImageInput.call(this,'idAuth') : _user.resetImageInput.call(this,'idAuth');
            this.listF.storeUrl  ?  _user.uploadedImageInput.call(this,'store') : _user.resetImageInput.call(this,'store');
            this.listF.businessLicenseUrl ? _user.uploadedImageInput.call(this,'businessLicense') : _user.resetImageInput.call(this,'businessLicense');
          },
          initValidate : function(){
            _user.initValidate.call(this,this.$refs.sender_form,this.$refs.sender_submit);
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
              ,idAuth : _vm.listF.idAuth
              ,store : _vm.listF.store
              ,businessLicense : _vm.listF.businessLicense //营业执照
              ,city : _vm.listF.city
              ,companyName : _vm.listF.companyName
              ,businessMobile : _vm.listF.businessMobile //业务员电话
            }
            this.ksvalidate.submit(data,function(res){},data);
          }

        }
    });

})
