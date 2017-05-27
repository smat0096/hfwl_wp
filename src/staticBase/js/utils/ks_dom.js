define(function(require,exports,module) {
"use strict";
//require("juery");
/**
 * 8. 表单
 * 9. dom操作
 */
var ks_dom = {
  /* 9. dom操作 E */
    //图片上传
    "uploadImage" :function(opts,callback){
      window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
      var _this = this,
          button = opts.button,
          input = opts.input,
          image = opts.image,
          revoke = opts.revoke,//如果为true,则加载完立刻回收资源;
          maxsize = opts.maxsize || 5000, //图片大小, 单位KB
          callback = callback || opts.callback,
          res;
      if(!input) return;
      button && button.addEventListener('click', function(e){
        input.click();
      });
      input.addEventListener('change', function(e){
          //移动端微信会过滤尾缀
          if(!/image|\.jpeg|\.jpg|\.gif|\.png|\.bmp/i.test(this.value)){ 
              res = {
                  'success' : false,
                  'message' : '上传图片的类型不符要求'
              };
              console.error(res.message);
              callback && 'function' === typeof callback && callback(res);
              return;
          }
          var e = e||window.event;
          e.preventDefault();//阻止默认事件
          var file = this.files[0];
          if (file) {
              if(file.size > maxsize*1024){
                res = {
                  'success' : false,
                  'message' : '图片大小不能超过'+ maxsize+'KB!'
                };
                console.error(res.message);
                callback && 'function' === typeof callback && callback(res);
                return;
              }
              var read = new FileReader();//新建一个读取文件对象
              read.readAsDataURL(file);//读取文件
              //可用 read.onreadystatechange
              read.onload = function(){//读取成功后回调
                read.onload = null;
                var objectURL= window.URL.createObjectURL(file);
                res = {
                  'success' : true,
                  'data' : read.result,//传入base64数据格式
                  'url' : objectURL
                };
                callback && 'function' === typeof callback && callback(res);
                if(image){
                  image.src  = objectURL;
                  if(revoke){ 
                    image.onload = function(){window.URL.revokeObjectURL(objectURL)}
                  };
                };
              };
          }else{
            res = {
              'success' : false,
              'message' : '运行环境错误,图片读取失败!'
            };
            console.error(res.message);
            callback && 'function' === typeof callback && callback(res);
            return;
          };
      })
    }
  /* 9. dom操作 E */
};

window.ks_dom = window.ks_dom || ks_dom;
return window.ks_dom;

});
