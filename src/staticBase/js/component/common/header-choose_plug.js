define(function(require, exports, module) {
  "use strict";
  var commonBase = require("commonBase");
  var cityPlug = commonBase.cityPlug,
  citySite = require("site"),
  cityTxt = commonBase.txt,
  setData = commonBase.setData,
  initChoose = {
    init: function(t) {
      this._initChoose(t);
      return this;
    },
    _initChoose: function(options) {
      var defaults = {
        site: citySite,                //城市data
        TXT: cityTxt,                  // staticTXT 其它静态data
        SetData: setData,              // 弹出层的操作dom,把data显示到视图
        plugBox: $("#js_city_plug_1"), //容器
        //回调函数
        carCallBack: function(data){console.log(data)}, 
        toCallBack: function(data){console.log(data)},
        fromCallBack: function(data){console.log(data)},
        tpl: true,
        fromIndex: 2,
        toIndex: 2
      }
      options = $.extend({},defaults, options);
      this.instance = cityPlug.init(options);
    },
    destroy : function(){
      this.instance.destroy();
      this.instance = null;
    }
  };
  exports.init = function(t) {
    return initChoose.init(t);
  };
  exports.destroy = function(t) { 
      initChoose.destroy();
  }
});
