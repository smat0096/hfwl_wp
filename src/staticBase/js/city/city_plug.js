define(function(require, exports, module) {
  var chose_city = require("./chose_city"),
    chose_tpl = require("tpl/city_plug");
    chose_tpl = template.compile(chose_tpl)();
  var n = {
      init: function(opts) {
        this.opts = opts;
        this.plugBox = this.opts.plugBox;
        this.opts.tpl || this.opts.plugBox.html(chose_tpl);
        this.opts.fromAllWhole = 1 == this.opts.fromAllWhole ? false : true;
        this.oFromBtn = this.plugBox.find(".js_from_btn"); 
        this.oFromSpan = this.oFromBtn.find(".js_c_txt");
        this.oFromInp = this.oFromBtn.find(".js_c_inp");
        this.oFromBox = this.plugBox.find(".js_from");
        this.oToBtn = this.plugBox.find(".js_to_btn");
        this.oToSpan = this.oToBtn.find(".js_c_txt");
        this.oToInp = this.oToBtn.find(".js_c_inp");
        this.oToBox = this.plugBox.find(".js_to");
        this.carBtn = this.plugBox.find(".js_car_btn");
        this.carSpan = this.carBtn.find(".js_c_txt");
        this.carInp = this.carBtn.find(".js_c_inp");
        this.carInfo = this.plugBox.find(".js_car_info");
        this.carLen = this.carInfo.find(".js_car_len");
        this.carType = this.carInfo.find(".js_car_type");
        this.confirmBtn = this.plugBox.find(".js_confirm_btn");
        this.confirmCarBtn = this.plugBox.find(".js_confirm_car_btn");
        this.slidePop = this.plugBox.find(".js_slide_pop");
        this.choseCarLData = "";
        this.choseCarTData = "";
        this.callBackData = {
          from: {
            id: -1,
            name: "全国"
          },
          to: {
            id: ["-1"],
            name: ["全国"]
          },
          car: {
            len: "不限",
            type: "不限"
          }
        };
        chose_city.init({
          allWhole: n.opts.fromAllWhole,
          data: n.opts.site,
          oTrigger: n.oFromBtn,
          oBox: n.oFromBox,
          zIndexData: n.opts.fromIndex || 3,
          callBack: n.fnFrom
        });
        chose_city.init({
          data: n.opts.site,
          oTrigger: n.oToBtn,
          oBox: n.oToBox,
          limit: 5,
          zIndexData: n.opts.toIndex || 3,
          callBack: n.fnTo
        });
        n.opts.SetData.init({
          oBox: n.carLen,
          data: n.opts.TXT.VEHICLE_LENGTHS,
          callBack: n.fnCarLen
        });
        n.opts.SetData.init({
          oBox: n.carType,
          data: n.opts.TXT.VEHICLE_TYPES,
          callBack: n.fnCarType
        }), 
        this.pageH(), 
        this.bind(), 
        this.setFrom();
        //ks change
        return n;
      },
      destroy :function(){
        this.opts.plugBox.off().html('');
        this.opts.plugBox = null;
      },
      setFrom: function() {
        this.opts.curFromId && (this.callBackData.from.id = this.opts.curFromId, this.callBackData.from.name = this.opts.curFromName, this.oFromSpan.html(this.opts.curFromName), this.oFromInp.val(this.opts.curFromId))
      },
      pageH: function() {
        var t = $("#js_header_box").height(), /* waitForChange */
          i = $(window).height(),
          e = 25,
          a = i - t - e;
          a += 50;
        800 > i && (a -= 110), this.slidePop.css("height", a + "px")
      },
      bind: function() {
        this.oFromBtn.on("click", function() {
          n.fnToggle(n.oFromBtn, n.oFromBox)
        }), this.oToBtn.on("click", function() {
          n.fnToggle(n.oToBtn, n.oToBox)
        }), this.carBtn.on("click", function() {
          n.fnToggle(n.carBtn, n.carInfo)
        }), n.confirmBtn.on("click", function() {
          n.toData && n.toData.id.length && (n.oToSpan.html(n.toData.name.join(",")), n.oToInp.val(n.toData.id.join(",")), n.callBackData.to = n.toData), n.oToBox.hide(), n.oToBtn.removeClass("active"), n.callBack(n.opts.toCallBack)
        }), n.confirmCarBtn.on("click", function() {
          var t = $.trim(n.choseCarLData + " " + n.choseCarTData) || "不限";
          n.carSpan.html(t), n.carInp.val(t), n.carBtn.removeClass("active"), n.carInfo.hide(), n.callBack(n.opts.carCallBack)
        })
      },
      fnToggle: function(t, i) {
        this.slidePop.hide(), t.hasClass("active") ? t.removeClass("active") : (t.addClass("active"), i.show()); 
        t.siblings("li").removeClass("active")
      },
      fnFrom: function(t) {
        n.fromData = t;
        n.oFromSpan.html(t.name), n.oFromInp.val(t.id), n.oFromBox.hide(), n.oFromBtn.removeClass("active"), n.callBackData.from = t, n.callBack(n.opts.fromCallBack)
      },
      fnTo: function(t) {
        n.toData = t
      },
      fnCarLen: function(t) {
        n.choseCarLData = "不限" == t.choseData ? "" : t.choseData, n.callBackData.car.len = t.choseData
      },
      fnCarType: function(t) {
        n.choseCarTData = "不限" == t.choseData ? "" : t.choseData, n.callBackData.car.type = t.choseData
      },
      callBack: function(t) {
        t && "function" == typeof t && t(this.callBackData)
      }
    };
  module.exports = n;
})
