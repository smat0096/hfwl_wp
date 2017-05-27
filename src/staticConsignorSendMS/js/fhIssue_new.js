define(function(require, exports, module) {
  // 配置表单ajax获取数据 : 300行 getData 方法
  var a = require("commonBase"),
    i = a.common,
    o = require("site"), //数据量过大,加载bug window._base.site,//
    s = require("./floor"),
    c = a.dialog,
    _user = null, //用户数据
    //ks_chage_ajaxUrl
    postUrl = window._G_.url.sendgoods_post, //提交数据接口
    getUrl =  window._G_.url.sendgoods_get, //从常发货源再次发货跳转时获取数据的接口
    //f = require("./tpl/redPacket"),
    _ks = require('utils/ks_utils.js');
    var _ = { // _fetchData
      _fetchData : function(opts){
        var _t = this;
        var defaults = {
          type: "GET",
          async: true,
          url: '',
          data: {
            userId :  _user.id
          },
          dataType: "json",
          success : function(){

          },
          error : function(){
            i.layer(t.errorMsg)
          }
        };
        var _data = $.extend({},defaults.data,opts.data);
        opts = $.extend({},defaults,opts);
        opts.data = _data;
        return $.ajax(opts);
      },
      init: function() {
        this.fhBox = $("#js_fh_box"), 
        this.isCollect = false, 
        this.placeholder(), 
        this.dataInit(), 
        this.bind()
      },
      bind: function() {
        $("#js_sub").on("click", this.fnSubform);
        $("input.js_num").on("blur", function() {
          var t = $(this),
            n = parseInt($.trim(t.val())) || "";
          t.val(n), _.changeTxt()
        });
        $("#js_set_fh").on("click", function() {
          $(this).hasClass("set_btn_s") ? (_.isCollect = false, $(this).removeClass("set_btn_s")) : (_.isCollect = true, $(this).addClass("set_btn_s"))
        })
      },
      placeholder: function() {
        this.fhBox.on("click", "div.js_inp", function() {
          $(this).find("b").hide(), $(this).find("input").focus()
        });
        this.fhBox.on("blur", 'input[type="text"]', function() {
          var t = $(this).closest("div.js_inp");
          $(this).val() || t.find("b").show()
        })
      },
      dataInit: function() {
        this.cityData($("#js_from"), $("#dialog_floor_from")); 
        this.cityData($("#js_to"), $("#dialog_floor_to"));
        this.setData($("#js_goods_type"), $("#dialog_floor_goodsType"), a.txt.CARGO_TYPES);
        this.unit();
        this.carInfo();
        this.setBtn();
      },
      cityHtml: function() {
        var t = '<div class="city_box">                    <div class="city_info">                    <div class="js_city_txt">                    <p class="city_txt">选择省份：</p>                </div>                <div class="clearfix js_city_txt" style="display: none;">                    <p class="city_txt fl">当前所在省份：<span class="js_name"></span></p>                    <a href="javascript:;" class="fr city_txt js_back">返回上一级</a>                    </div>                    <table class="js_table"></table>                    </div>                    </div>';
        return t
      },
      cityData: function(t, n) {
        n.find(".js_con").html(_.cityHtml()), a.city.init({
          allWhole: true,
          isProvince: true,
          data: o,
          oTrigger: t,
          oBox: n,
          callBack: function(e, a) {
            var i = "",
              o = "";
            3 == a.length ? (i = a[0].name == a[1].name ? a[1].name + a[2].name : a[0].name + a[1].name + a[2].name, o = a[1].name + a[2].name) : 2 == a.length && (i = a[0].name == a[1].name ? a[1].name : a[0].name + a[1].name, o = a[1].name);
            var c = t.attr("id");
            "js_from" == c ? _.from = o : "js_to" == c && (_.to = o), t.find('input[type="text"]').val(i).removeAttr("style"), t.find('input[type="hidden"]').val(e.id), t.find("b").hide(), s.close(n), _.changeTxt()
          }
        });
        t.on("click", function() {
          s.open(n)
        });
        n.find(".js_floor_close").on("click", function() {
          s.close(n)
        })
      },
      setData: function(t, n, e) {
        n.attr("id");
        a.setData.init({
          oBox: n,
          data: e,
          callBack: function(e) {
            t.find('input[type="text"]').val(e.choseData), _.changeTxt(), t.find("b").hide(), s.close(n)
          }
        }), t.on("click", function() {
          s.open(n)
        }), n.find(".js_floor_close").on("click", function() {
          s.close(n)
        })
      },
      unit: function() {
        this.jsCountBtn = $(".js_count"), this.jsCountDom = $("#dialog_floor_goodsUnit"), a.setData.init({
          oBox: _.jsCountDom,
          data: a.txt.UNIT,
          callBack: function(t) {
            _.jsCountBtn.each(function() {
              var n = $(this),
                e = n.closest("tr"),
                i = e.data("type");
              if ("num" == i) {
                var o = a.txt.UNIT.indexOf(t.choseData);
                e.find("span.js_unit").html(t.choseData), e.find('input[type="hidden"]').val(o + 1)
              } else e.find("span.js_unit").html("元/" + t.choseData), e.find('input[type="hidden"]').val(t.choseData)
            }), s.close(_.jsCountDom), _.changeTxt()
          }
        }), this.jsCountBtn.on("click", function() {
          s.open(_.jsCountDom)
        }), this.jsCountDom.find(".js_floor_close").on("click", function() {
          s.close(_.jsCountDom)
        })
      },
      carInfo: function() {
        this.carBox = $("#dialog_floor_carType"), this.carBtn = $("#js_car_type"), this.carArr = [], a.setData.init({
          oBox: $("#js_car_lbox"),
          data: a.txt.VEHICLE_LENGTHS,
          callBack: _.carLCall
        }), a.setData.init({
          oBox: $("#js_car_tbox"),
          data: a.txt.VEHICLE_TYPES,
          callBack: _.carTCall
        }), this.carBtn.on("click", function() {
          s.open(_.carBox)
        }), this.carBox.find(".js_floor_close").on("click", function() {
          if (_.carArr.length > 0) {
            _.carBtn.find("b").hide();
            var t = "";
            _.carArr[0] && _.carArr[1] ? (_.carArr[0] && "不限" != _.carArr[0] && (t += _.carArr[0]), _.carArr[1] && "不限" != _.carArr[1] && (t += _.carArr[1]), "不限" == _.carArr[0] && "不限" == _.carArr[1] && (t = "不限")) : t = _.carArr[0] || _.carArr[1], _.carBtn.find('input[type="text"]').val(t)
          }
          _.changeTxt(), s.close(_.carBox)
        })
      },
      carLCall: function(t) {
        _.carArr[0] = t.choseData
      },
      carTCall: function(t) {
        _.carArr[1] = t.choseData
      },
      setBtn: function() {
        this.setInfo = $("#js_set_info"), this.setTip = $(".js_tip"), $("#js_set_btn").on("click", function() {
          _.setInfo.toggle(), _.setTip.hide()
        }), this.setInfo.on("click", "div", function() {
          var t = $(this),
            n = t.find('input[type="hidden"]'),
            e = t.index();
          t.hasClass("set_btn_s") ? (t.removeClass("set_btn_s"), _.setTip.eq(e).hide(), n.val(0)) : (t.addClass("set_btn_s"), _.setTip.eq(e).show(), n.val(1))
        })
      },
      changeTxt: function() {
        var t = "",
          n = "",
          e = "";
        _.to && _.from ? t += _.from + " -> " + _.to : _.to ? t += _.to : _.from && (t += _.from);
        var a = $('input[name="cargoType"]').val(),
          i = $('input[name="load"]').val(),
          o = $('input[name="price"]').val();
        (a || i) && (i && (n = $('input[name="load"]').closest("tr"), e = n.find("span.js_unit").html(), i += e), t += "，有" + a + i);
        var s = _.carArr[1],
          c = _.carArr[0];
        s && c ? t += "不限" == s && "不限" == c ? "，求车" : "不限" == s ? "，求" + c + "车" : "不限" == c ? "，求" + s + "车" : "，求" + c + s + "车" : s && "不限" != s ? t += "，求" + s + "车" : c && "不限" != c && (t += "，求" + c + "车"), o && (n = $('input[name="price"]').closest("tr"), e = n.find("span.js_unit").html(), o += e, t += "，" + o), $("#js_content").val(t)
      },
      fnSubform: function() {
        for (var t = {
            fromId: "请选择出发地",
            toId: "请选择到达地",
            content: "请填写备注信息"
          }, n = $("#fh_goods").serializeArray(), e = {}, a = 0, o = n.length; o > a; a++) {
          var s = n[a].value,
            c = n[a].name;
          if (s) "resend" == c ? 1 == s ? (e.resendCount = 30, e.resendInterval = 20) : (e.resendCount = 0, e.resendInterval = 0) : e[c] = s;
          else if (t[c]) return void i.layer(t[c], c)
        }
        _.carArr.length > 0 && (_.carArr[0] && (e.carLen = _.carArr[0]), _.carArr[1] && (e.carType = _.carArr[1]));
        // ks_change 这里传输数据
        e.isCollect = (!!_.isCollect)-0;
        _._fetchData({
          url: postUrl,
          data: e
        }).done(function(t){
          "OK" == t.status ? i.layer("发布成功！") : i.layer(t.errorMsg);
            _.pageReolad();
        })
      },
      collectFun: function(t) {
        t.load && (t.numLoad = t.load, delete t.load), t.price && (t.numPrice = t.price, delete t.price), t.unit && (t.load = t.unit, delete t.unit), t.priceUnit && (t.price = "元/" + t.priceUnit, delete t.priceUnit); {
          //var n = r + "/web/api/common/message/collect/add", e = t;
          //i.post(n, e)
        }
      },
      pageReolad: function() {
        for (var t = $("#js_load"), n = $("#js_price"), e = $("#js_content"), a = [$("#js_to"), $("#js_car_type"), $("#js_goods_type"), $("#js_load"), $("#js_price")], i = 0, o = a.length; o > i; i++) a[i].find("b").show(), a[i].find("input").val("");
        _.to = "", _.carArr = [], t.find(".js_unit").html("吨"), t.find('input[name="unit"]').val(1), n.find(".js_unit").html("元/吨"), n.find('input[name="unit"]').val("吨"), e.val(""), _.setInfo.hide().find(".set_btn").removeClass("set_btn_s"), _.setTip.hide(), $('input[name="resend"]').val(0), $('input[name="hiddenForLocal"]').val(0), $("#js_set_fh").removeClass("set_btn_s"), _.isCollect = false, $(".js_floor_content").find("ul.s_list li").removeClass("s")
      },
      destroy : function(){
      }
    };
  exports.init = function(user) {
    _user = user;
    $(function() {
      _.init();
      p.init();
    })
  };  
  exports.destroy = function(user) {
    _.destroy();
    p.destroy();
  };
  Array.prototype.indexOf = function(t) {
    for (var n = 0, e = this.length; e > n; n++)
      if (this[n] === t) return n;
    return -1
  };
  var p = {
    init: function() {
      return this.id = this.getId(), this.id ? (this.getData(), true) : false;
    },
    destroy :function(){
      $("#js_from").off().html('');
    },
    getId: function() {
      var t = window.location.search || window.location.hash , n = false;
      if (t) {
        n = _ks.getUrlParam('messageId','hash');
      }
      return n
    },
    getData: function() {
      //从常发货源再次发货跳转时获取数据的接口
      _._fetchData({
        url : getUrl,
        data: { messageId : p.id }
      }).done(function(t){
        "OK" == t.status ? p.setData(t.content) : i.layer(t.errorMsg)
      })
    },
    setData: function(t) {
      var n = $("#js_from"),
        e = $("#js_to"),
        i = $("#js_car_type"),
        o = $("#js_goods_type"),
        s = $("#js_load"),
        c = $("#js_price"),
        r = $("#js_content"),
        l = $("#js_resend_box"),
        d = $("#js_hiddenForLocal");
      if (t.fromId && (n.find('input[name="fromId"]').val(t.fromId), _.from = t.from.replace(/,/g, ""), $("#js_from_name").val(_.from), n.find("b").hide()), t.toId && (e.find('input[name="toId"]').val(t.toId), _.to = t.to.replace(/,/g, ""), $("#js_to_name").val(_.to), e.find("b").hide()), (t.carType || t.carLen) && (i.find("b").hide(), i.find("input").val(t.carLen + t.carType), t.carLen && (_.carArr[0] = t.carLen), t.carType && (_.carArr[1] = t.carType)), t.cargoType && (o.find("b").hide(), o.find("input").val(t.cargoType)), t.numLoad) {
        s.find("b").hide(), s.find('input[name="load"]').val(t.numLoad), s.find(".js_unit").html(t.load);
        var f = a.txt.UNIT.indexOf(t.load);
        s.find('input[name="unit"]').val(f + 1)
      }
      t.numPrice && (c.find("b").hide(), c.find('input[name="price"]').val(t.numPrice), c.find(".js_unit").html(t.price), c.find('input[name="priceUnit"]').val(t.load)), t.content && r.val(t.content), t.resendCount && (l.addClass("set_btn_s"), l.find('input[name="resend"]').val(1), _.setInfo.show()), t.hiddenForLocal && (d.addClass("set_btn_s"), d.find('input[name="hiddenForLocal"]').val(1), _.setInfo.show())
    }
  }
})
