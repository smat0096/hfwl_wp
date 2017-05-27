define(function(require, exports, module) { 
  var common = require("./common"),
    city = require("./city/chose_city.js"),
    cityPlug = require("./city/city_plug.js"),
    cityPlug_ks = require("./city/city_plug_ks.js"),
    txt = require("./staticTXT.js"),
    setData = require("./setLayerData.js"),
    floor = require("./dialog/floor.js"),
    map = require("./map.js"),
    carNumber = require("./plug/carNumber.js"),
    dialog = require("./dialog/dialog.js"),
    blueDialog = require("./dialog/blueDialog.js"),
    //call = require("./call.js"),
    squareOverlay = require("./squareOverlay.js");
    //TOFIXED 注释电话
  return {
    common: common,
    city: city,
    cityPlug: cityPlug,
    cityPlug_ks: cityPlug_ks,
    txt: txt,
    setData: setData,
    floor: floor,
    map: map,
    carNumber: carNumber,
    dialog: dialog,
    //call: call,
    squareOverlay: squareOverlay,
    blueDialog: blueDialog,
  }
});
