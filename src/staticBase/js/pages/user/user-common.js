define(function(require,exports,module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common,
      _dom = _base.dom,
      KsValidate = _base.validate,
      valiOpts = _base.valiOpts;

  var _user = {
    resetImageInput : function(name){
      var inputClass = name + 'InputClass'; // avatarInputClass input框样式名
      var inputName = name + 'Input';       // avatarInput input dom名
      var imageUrl = name + 'Url';          //. avatarUrl 图片链接名

      this.listF[name] = ''; //this.listF.avatar base64数据, 默认有图无数据就是 OK
      this[inputClass] = 'weui-uploader__input-box';// this.listF.avatarInputClass
      this.$refs[inputName].value = '';  // this.$refs.avatarInput.value  表单dom值
      this.listF[imageUrl] = '';  //this.listF.avatarUrl 图片链接
    },

    uploadedImageInput : function (name,data){
      var inputClass = name + 'InputClass';// avatarInputClass input框样式名
      var imageName = name + 'Image'; // avatarImage 图片dom名
      var imageUrl = name + 'Url';  // avatarUrl 图片链接名
      this[inputClass]  = 'weui-uploader__files'; //this.avatarInputClass input框样式
      this.listF[name] = 'OK'; //this.listF.avatar base64数据, 默认有图无数据就是 OK


      if(data){
        //释放前一个资源
        var imageUrlOrigin = this.listF[imageUrl];
        (/^blob\:/.test(imageUrlOrigin)) && (window.URL.revokeObjectURL(imageUrlOrigin));
        
        this.listF[name] = data.data;  //this.listF.avatar base64数据
        this.listF[imageUrl] = data.url; //this.listF.avatarUrl 图片链接
        // this.$refs[imageName].onload = function(){  //this.$refs.avatarImage 图片dom
        //   window.URL.revokeObjectURL(data.url);  //回收资源
        // }
      }
    },
    initUploadEvt : function (name){
      var _vm = this;
      var inputName = name + 'Input';
      var opts = {
        input : this.$refs[inputName]
      };
      _dom.uploadImage(opts,function(data){
        if(data.success){
          _user.uploadedImageInput.call(_vm,name,data);
        }else{
          $.alert(data.message);
          //_user.resetImageInput.call(_vm,name);
        }
      });
    },
    initValidate : function(form,submitBtn,autoSubmit){
      var _vm = this;
      var _opts = {
        form : form,
        submitBtn : submitBtn,
        ajax:{
          url : _vm.formUrl,
          success : function(res){
            if(res.status === 'OK'){
              $.toast('提交成功');
            }else{
              var message = res.errorMsg || '提交失败';
              $.toast(message, "cancel");
            }
          },
          error : function(res){
              var message = res.errorMsg || '提交失败';
              $.toast(message, "cancel");
          },
          complete : function(){
            _vm.$router.push('./userSetting');
          }
        },
        extend : {
          beforeSubmit : function(opts){
            _vm.isSubmiting = true;
          },
          afterSubmit : function(opts){
            _vm.isSubmiting = false;
          }
        }
      };
      var opts = $.extend({},valiOpts,_opts);
      if(!autoSubmit) opts.extend.initEvent = null;
      _vm.ksvalidate = KsValidate(opts);
    },
    checkWarningByAjax : function(data, callback){
      data.t = new Date().getTime();
      return $.ajax({
          type: "GET",
          url: window._G_.url.user_checkBusinessMobile,
          data: data,
          dataType: "json",
          timeout: 1e4,
          success : function(res){
            if(res.status === "OK"){
              callback && callback();
            }else{
              _confirm(data.errorMsg);
            }
          },
          error : function(){
            _confirm(data.errorMsg);
          }
      });
      function _confirm(errorMsg){
        $.confirm({
          title: '提示',
          text: errorMsg,
          onOK: function () {
            callback && callback();
          },
          onCancel: function () {
          }
        });
      }
    }
  };
  return _user;
})
