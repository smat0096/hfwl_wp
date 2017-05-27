/** 作者 空山, 112093112 **/

define( function(require, exports, module) {
  var opts = require("./ks_validate_options");
  var KsValidate = require("./ks_validate.js");
  var _opts = {
    checkType : 'input',
    delay : '500'
  };
  opts = $.extend({},opts,_opts);
  ksvalidate = KsValidate(opts);
        
  /* 全局替换 KsValidate S */
  var KsValidateReplace = {
        showSuccess : function(data){
          console.log(data)
          //$.toptip("添加熟车成功", 2000, 'success'); 
        },
        showWarn : function(data){
          console.log(data.message, 2000, 'warn'); 
        },
        // showError : function(data){
        //   alert(data.message, 'forbidden'); 
        // }
      };
  $.extend(KsValidate.fn ,KsValidateReplace );
  /* 全局替换 KsValidate E */
  
  /** 自定义提交时验证 
  submit.onclick = function(){
    console.log(ksvalidate.form);
    ksvalidate.validate({
      name : form.name.value,
      mobile : form.mobile.value,
      comment : form.comment.value
    },
    function(results){
      //ksvalidate.showErrors(errors);
      console.log(results);
      if(!results.isFail){
        alert('成功提交')
      }
    })
  };

  /** 自定义失焦时验证 **/
  ksvalidate.form.name.addEventListener('blur',function(){
    var target = data = {
      name : form.name.value,
      mobile : form.mobile.value
    };
    ksvalidate.check(data,function(results){
      //ksvalidate.showErrors(errors);
      if(!results.isFail){
        alert('成功提交')
      }
    }, target)
  });
  /**  **/


  return ksvalidate;
})
