define(function(require,exports,module) {
  "use strict";

  var _carport = {
    //添加联系人
    addContact : function(data){
      var id = data.carId;
      if(!id) {
        console.error("点击联系ID错误", id);
        //return;
      }
      var opts = {
        type: "GET",
        async: true,
        dataType: "json",
        url: window._G_.url.carport_post_addcontact,
        data: {
          'id' : id,
          'action' : 'carportAddContact',
          't' : new Date().getTime()
        },
        success : function(res){
        },
        error : function(res){
          console.error("点击联系返回值错误",res);
        },
        complete : function(res){
        }
      };
      opts.data = _ks.extend({},opts.data,data);
      return $.ajax(opts);
    },
    // carport 车源操作
    postDataVm : function(opts){
      var _vm = this;
      _vm.isPosting = true;
      var _opts = {
        url: opts.url,
        type: "GET",
        async: true,
        dataType: "json",
        data: {
          'userId' : _vm.user.id
        },
        success : function(res){
          if(res.status==="OK"){
            opts.msgSuccess && $.toast(opts.msgSuccess,'1000');  
          }else{
            opts.msgError && $.toast(opts.msgError, "cancel");
          }
        },
        error : function(res){
          opts.msgError && $.toast(opts.msgError, "cancel");
          console.error(res)
        },
        complete : function(res){
          _vm.isPosting = false;
        }
      };
      _opts.data = _ks.extend({},_opts.data,opts.data);
      return $.ajax(_opts);
    }
  };
  return _carport;
})
