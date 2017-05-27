define(function(require,exports,module) {
  "use strict";
  var _ks = require('utils/ks_utils.js'),
      _common = require('utils/ks_common.js');
  var _findgoods = {
    addContact : function(data){
      var opts = {
        type: "GET",
        async: true,
        dataType: "json",
        url: window._G_.url.findgoods_post_addcontact,
        data: {
          'action' : 'findgoodsAddContact',
          't' : new Date().getTime()
        },
        error : function(res){
          console.error("货源点击联系返回值错误",res);
        }
      };
      opts.data = _ks.extend({},opts.data,data);
      return $.ajax(opts);
    },
    reqWaitlistDateVm: function(opts){
      var _vm = this;
      _vm.isLoadingAdd = true;
      _vm.reqLast = new Date();
      var _opts = {
        url: _vm.loadAddUrl,
        type: "GET",
        async: true,
        dataType: "json",
        data: {
          'userId' : _vm.user.id,
          'fromId' : _vm.cityPlugData.fromId,
          'from' : _vm.cityPlugData.from,
          'toIds' : _vm.cityPlugData.toIds,
          'to' : _vm.cityPlugData.to,
          'carLen' : _vm.cityPlugData.carLen,
          'carType': _vm.cityPlugData.carType,
          'pageAdd' : _vm.pageAdd,
          'pageSize' : _vm.pageSize,
          'minId' : _vm.minId
        },
        success : function(res){
          res = _common.digestData(res);
          var listData = res.content && res.content.messages || [];
          if(res.status==="NO"){
            _vm.hasAdd = false;
            $.alert(res.errorMsg);
          }else if(!listData.length){
            _vm.hasAdd = false;
          }else if(res.status==="OK"){
            _vm.hasAdd = true;
            _vm.pageAdd++;
            listData =  _common.formatList(listData, opts);
            _vm.listDataF = _vm.listDataF.concat(listData);
            _vm.waitlistDataF = _vm.addWaitList(listData);
          }
        },
        complete : function(res){
          _vm.isLoadingAdd = false;
        }
      };
      return $.ajax(_opts);
    }
  
  };
  return _findgoods;
})
