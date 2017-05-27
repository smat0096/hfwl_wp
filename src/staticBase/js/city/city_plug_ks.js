define(function(require, exports, module) {

  var chose_city = require("./chose_city"),
    city_plug_tpl = require("tpl/city_plug");
    city_plug_tpl = template.compile(city_plug_tpl)();

  var n = {
      init: function(opts) {
        this.opts = opts;
        this.plugBox = this.opts.plugBox;
        this.opts.tpl || this.opts.plugBox.html(city_plug_tpl);
        this.opts.fromAllWhole = 1 == this.opts.fromAllWhole ? false : true;

        this.oCityBtn = this.plugBox.find(".js_city_btn"); 
        this.oCitySpan = this.oCityBtn.find(".js_c_txt"); 
        this.oCityNameInp = this.oCityBtn.find(".js_city_name_inp"); 
        this.oCityCodeInp = this.oCityBtn.find(".js_city_code_inp"); 
        this.oSlidePop = this.plugBox.find(".js_slide_pop");
        this.oCityBox = this.plugBox.find(".js_city_box"); 
        this.oConfirmBtn = this.oSlidePop.find(".js_confirm_btn");

        this.choseCarLData = "";
        this.choseCarTData = "";
        this.callBackData = {
          city: {
            id: -1,
            name: "全国"
          }
        }; 
        chose_city.init({
          //allWhole: n.opts.fromAllWhole,
          limit: 5,
          data: n.opts.site,
          oTrigger: n.oCityBtn,
          oBox: n.oCityBox,
          zIndexData: n.opts.cityIndex || 3,
          callBack: n.fnCity
        }); 
        this.pageH();
        this.bind();
        this.setCity();
      },
      setCity: function() {
        this.opts.curCityId && (this.callBackData.city.id = this.opts.curCityId, this.callBackData.city.name = this.opts.curCityName, this.oCitySpan.html(this.opts.curCityName), this.oCityNameInp.val(this.opts.curCityName), this.oCityCodeInp.val(this.opts.curCityId))
      },
      pageH: function() {
        var t = $("#js_header_box").height(), /* waitForChange */
          i = $(window).height(),
          e = 25,
          a = i - t - e;
          a += 50;
        800 > i && (a -= 110);
        //this.oSlidePop.css("height", a + "px");
      },
      bind: function() {
        this.oCityBtn.on("click", function() {
          n.fnToggle(n.oCityBtn, n.oCityBox)
        });
        n.oConfirmBtn.on("click", function() {
          n.cityData && n.cityData.id.length && (n.oCitySpan.html(n.cityData.name.join(",")), n.oCityNameInp.val(n.cityData.name.join(",")), n.oCityCodeInp.val(n.cityData.id.join(",")), n.callBackData.city = n.cityData)
          n.oCityBox.hide(); 
          n.oCityBtn.removeClass("active");
          n.callBack(n.opts.cityCallBack);
        });
      },
      fnToggle: function(t, i) {
        $(".js_slide_pop").hide();
        t.hasClass("active") ? (t.removeClass("active")) : (t.addClass("active"), i.show());
        t.siblings("li").removeClass("active");
      },
      fnCity: function(t) {
        n.cityData = t;
      },
      callBack: function(t) {
        t && "function" == typeof t && t(this.callBackData)
      }
    };
  exports.init = function(opts) {
    $(function() {
      n.init(opts)
    })
  }
})
