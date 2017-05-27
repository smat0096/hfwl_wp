define(function(require, exports, module) {
  var o = require("commonBase");
  //alert(o)
  //var aaa = require("jQuery");
  var c = o.cityPlug,
    a = require("site"),
    f = o.txt,
    e = o.setData,
    r = {
      init: function(t) {
        var n = {
          site: a,
          TXT: f,
          SetData: e,
          plugBox: $("#js_city_plug"),
          carCallBack: r.fnCar,
          toCallBack: r.fnTo,
          fromCallBack: r.fnFrom,
          curFromId: "",
          curFromName: ""
        };
        $.extend(n, t), c.init(n)
      },
      fnCar: function(t) {alert(1)},
      fnTo: function(t) {alert(2)},
      fnFrom: function(t) {alert(3)}
    };
  exports.init = function(t) {
    $(function() {
      r.init(t)
    })
  }
  
});
