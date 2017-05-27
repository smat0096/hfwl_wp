define(function(require, exports, module) {
  var e = require("commonBase"),
    n = e.common,
    s = (e.call, {
      detail: require("tpl/detail")
    }),
    o = {
      _init: function(t) {
        this._compile();
        this._getDataDetail(t);
      },
      _compile: function() {
        template.compile("detail", s.detail)
      },
      _render: function(t) {
        var i = this,
          a = t.from.split(","),
          e = t.to.split(",");
        t.fromArr = a, t.toArr = e, t.createTimeNew = i.formatTime(t.createTime);
        var o = function(t) {
          if (t) {
            for (var i = t.split(","), a = "", e = i.length - 1; e >= 0; e--) a += i[e];
            return a
          }
        };
        t._from = o(t.from), t._to = o(t.to);
        var r = [];
        t.mobile && r.push(t.mobile), t.mobile1 && r.push(t.mobile1), t.mobile2 && r.push(t.mobile2), t.mobile3 && r.push(t.mobile3), t.phoneArr = r, t.registerTime && (t._registerTime = n._getDateDiff(t.registerTime)), $("#JS_content_sourse").html(template.compile(s.detail)({
          data: t,
          baseUrl: window.DOMAIN_FIND
        }))
      },
      _getDataDetail: function(t) {
        var i = this,
          a = $("#JS_content_sourse"),
          e = window.SERVER_MS + "/web/message/cargo/detail",
          s = {
            id: t
          };
        a.addClass("loading_bg"); 
        a.removeClass("loading_bg");
        $(".js_tab_sourse").animate({left: "0px"});
        //$("#JS_layer_box").remove();
        //i._render(t.content);
        // n.post(e, s, function(t) {
        //   a.removeClass("loading_bg"), "OK" == t.status ? ($(".js_tab_sourse").animate({
        //     left: "0px"
        //   }), $("#JS_layer_box").remove(), i._render(t.content), i._loadImg(t.content)) : "ERROR" == t.status && t.errorMsg && n.layer(t.errorMsg)
        // }).complete(function() {
        //   a.removeClass("loading_bg")
        // })
      },
      _loadImg: function(t) {
        if (t.attachmentUrlPrefix) {
          var i = t.attachmentUrlPrefix + "/figure.jpg!200",
            a = new Image;
          a.onload = function() {
            setTimeout(function() {
              $("#JS_list_avator_1").html("<img src=" + i + ">")
            }, 0)
          }, a.src = i
        }
      },
      formatTime: function(t) {
        var i = 864e5,
          a = (new Date).getTime(),
          e = new Date(t),
          n = "",
          s = e.getMinutes(),
          o = e.getHours(),
          r = e.getDate(),
          l = e.getMonth() + 1;
        return 10 > o && (o = "0" + o), 10 > r && (r = "0" + r), 10 > l && (l = "0" + l), 10 > s && (s = "0" + s), n = i > a - t ? "今天 " + o + ":" + s : l + "-" + r + " " + o + ":" + s
      }
    };
  exports.init = function(t) {
    o._init(t)
  }
})
