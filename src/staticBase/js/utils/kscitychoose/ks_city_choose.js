define(function(require, exports, module) {
  var commonBase = require("commonBase");
  var cityPlug = commonBase.cityPlug_ks,
  citySite = require("site"),
  cityTxt = commonBase.txt,
  setData = commonBase.setData,
  initChoose = {
    init: function(t) {
      this._initChoose(t);
    },
    _initChoose: function(options) {
      var defaults = {
        site: citySite,
        TXT: cityTxt,
        SetData: setData,
        cityCallBack: function(data){console.log(data)},
        tpl: true,
        cityIndex: 2
        ,curCityId : ''
        ,curCityName : ''
      };
      options = $.extend({},defaults, options);
      cityPlug.init(options);
    }
  };
  exports.init = function(t) {
    $(function() {
      initChoose.init(t)
    })
  }
  
});
