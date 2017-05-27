define(function(require, exports, module) {
  var n = require("commonBase"),
    e = n.common,
    s = n.call,
    o = n.map,
    r = require("./findContactList"),
    d = require("./sourseInfo"),
    c = {
      _init: function() {
        //this._run(), 
        //this._event()
        var a = this;
        $(".find_goods").on("click", ".JS_navigation", function() {
          a._showMap(), a._loadMap($(this))
        })
      },
      _run: function() {
        r.init()
      },
      _event: function() {
        var a = this;
        $("#JS_find_list").on("click", ".icon_find_phone", function() {
          var t = $(this).data("id");
          return a._takePhone(t), false
        }).on("click", ".list_item", function() {
          var t = $(this).data("id");
          a._showDetail(t)
        }), $(".find_goods").on("click", ".js_back_sourse", function() {
          a._hideDetail()
        }).on("click", ".js_back_map", function() {
          a._hideMap()
        }).on("click", ".JS_navigation", function() {
          a._showMap(), a._loadMap($(this))
        }).on("click", ".icon_big_phone", function() {
          var t = $(this).data("id");
          a._takePhone(t)
        }).on("click", ".JS_find_phone", function() {
          var a = $(this).data("id"),
            t = $(this).data("mobile"),
            i = $(this).data("userid");
          s.phoneCall({
            mobile: t,
            id: a,
            userId: i
          })
        })
      },
      _takePhone: function(a) {
        var t = window.SERVER_MS + "/web/message/cargo/detail",
          i = {
            id: a
          };
        e.loading.show(), e.post(t, i, function(a) {
          e.loading.hide(), "OK" == a.status ? s.phoneCall(a.content) : "ERROR" == a.status && a.errorMsg && e.layer(a.errorMsg)
        }).complete(function() {
          e.loading.hide()
        })
      },
      _showDetail: function(a) {
        d.init(a)
      },
      _hideDetail: function() {
        $(".js_tab_sourse").animate({
          left: "460px"
        }, function() {
          $("#JS_content_sourse").empty()
        })
      },
      _showMap: function() {
        $(".js_tab_map").animate({
          left: "0px"
        })
      },
      _hideMap: function() {
        $(".js_tab_map").animate({
          left: "460px"
        })
      },
      _loadMap: function(a) {
        var t = a.data("from"),
          i = a.data("to");
        o.searchRoute("JS_content_map", t, i, 0, function(a) {
          //var t = parseFloat(a.cg / 1e3).toFixed(1);
          //var j = a.getDuration(true);//获取时间
          var k = a.getDistance(true);//获取距离
          $("#JS_map_distance").html("此路程的里路程大约为：" + k)
        })
      }
    };
  exports.init = function() {
    //e.userLogin().then(function() {
      c._init()
    //})
  }
});
