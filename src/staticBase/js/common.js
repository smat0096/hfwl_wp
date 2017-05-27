define(function(require, exports, module) {
  var a = require("./dialog/dialog"),
    s = {
      post: function(t, i, e, o) {
        var n = {
          no_Session: false,
          no_win: false
        };
        o = $.extend(n, o);
        var l = {};
        o.no_Session || (l.sid = s.getCookie("sid"), l.st = s.getCookie("st"));
        var c = $.extend(l, i);
        return $.ajax({
          type: "POST",
          url: t,
          data: c,
          dataType: "json",
          timeout: 1e4,
          success: function(t) {
            if ("120001" == t.errorCode || "120002" == t.errorCode || "5" == t.errorCode || "120010" == t.errorCode || "20462002" == t.errorCode) {
              if (o.no_win) return;
              var i = t.errorMsg || "您已经下线，请重新登录!",
                s = '<div class="call_win" style="height: 180px;width: 300px;"><div class="call_win_cont" style="padding:54px 0;height:auto;"><p>' + i + '</p></div><div class="call_win_footer"><a href="javascript:;" class="blue js_call_close">确定</a></div></div>';
              return void a.init({
                html: s,
                isMaskClose: false,
                complete: function() {
                  $(".call_win .js_call_close").on("click", function() {
                    window.location.href = "login", a.close()
                  })
                }
              })
            }
            e && "function" == typeof e && e.call(this, t)
          },
          error: function(t) {
            if (!o.no_win) {
              var i = '<div class="call_win" style="height: 180px;width: 300px;"><div class="call_win_cont" style="padding:54px 0;height:auto;"><p>网络异常或请求超时！请刷新页面</p></div><div class="call_win_footer"><a href="javascript:;" class="blue js_call_close_1">确定</a></div></div>';
              a.init({
                html: i,
                complete: function() {
                  $(".call_win .js_call_close_1").on("click", function() {
                    a.close()
                  })
                }
              })
            }
          }
        })
      },
      goLogin: function() {
        window.location.href = "login"
      },
      setCookie: function(t, i, e) {
        e = e || 7, $.cookie(t, i, {
          expires: e
        })
      },
      getCookie: function(t) {
        return $.cookie(t)
      },
      layer: function(t) {
        $("#JS_layer_box").length > 0 && $("#JS_layer_box").remove();
        var i = t || "错误提示信息",
          e = $('<div class="layer_box" id="JS_layer_box">' + i + "</div>");
        $("body").append(e), setTimeout(function() {
          e.remove()
        }, 3e3)
      },
      loading: {
        flag: 1,
        dom: $('<div class="loading_win"></div>'),
        show: function() {
          var t = this;
          this.flag ? (this.flag = 0, $(document.body).append(t.dom)) : t.dom.show()
        },
        hide: function() {
          this.dom.hide()
        }
      },
      formateDate: function(t, i) {
        if (!t) return "";
        t = t || new Date, i = i || "yyyy-MM-dd";
        var e = new Date(t),
          a = {
            "M+": e.getMonth() + 1,
            "d+": e.getDate(),
            "h+": e.getHours(),
            "m+": e.getMinutes(),
            "s+": e.getSeconds(),
            "q+": Math.floor((e.getMonth() + 3) / 3),
            S: e.getMilliseconds()
          };
        /(y+)/.test(i) && (i = i.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var s in a) new RegExp("(" + s + ")").test(i) && (i = i.replace(RegExp.$1, 1 == RegExp.$1.length ? a[s] : ("00" + a[s]).substr(("" + a[s]).length)));
        return i
      },
      userLogin: function() {
        var t = window.SERVER + "/common/touch-session",
          i = {
            sid: s.getCookie("sid") || 1,
            st: s.getCookie("st") || 1
          };
        return $.ajax({
          type: "POST",
          url: t,
          data: i,
          dataType: "json",
          timeout: 1e4,
          success: function(t) {
            "OK" == t.status && (window.__userInfo = t.content)
          }
        })
      },
      templateFn: function() {
        template.helper("arrSort", function(t, i) {
          var e = t.split(","),
            a = e.length;
          return a > 1 ? (e.sort(function(t, i) {
            return parseFloat(t) - parseFloat(i)
          }), e[0] != e[a - 1] ? (t = e[0] + "-" + e[a - 1], i && (t = e[0] + i + "-" + e[a - 1] + i)) : (t = e[0], i && (t = e[0] + i))) : i && (t = e[0] + i), t
        }), template.helper("arrJoin", function(t, i) {
          var e = t.split(","),
            a = e.length;
          return a > 1 && (t = e[0] + i + e[a - 1]), t
        }), template.helper("arrCity", function(t) {
          if (t) {
            for (var i = t.split("|"), e = i.length, t = "", a = [], s = [], o = 0; e > o; o++) a = i[o].split(","), t = a[1] ? a[1] == a[0] ? a[0] : a[1] + a[0] : a[0], s[o] = t;
            return s.join(",")
          }
        })
      },
      _getDateDiff: function(t) {
        var i = (new Date).getTime(),
          e = i - t,
          a = "";
        if (!(0 > e)) {
          var s = 6e4,
            o = 60 * s,
            n = 24 * o,
            l = 30 * n,
            c = 12 * l,
            r = e / c,
            d = e / l,
            p = e / (7 * n),
            h = e / n,
            u = e / o,
            _ = e / s;
          return a = r >= 1 ? parseInt(r) + "年" : d >= 1 ? parseInt(d) + "个月" : p >= 1 ? parseInt(p) + "周" : h >= 1 ? parseInt(h) + "天" : u >= 1 ? parseInt(u) + "小时" : _ >= 1 ? parseInt(_) + "分钟" : "刚刚"
        }
      },
      _truckLoad: function(t) {
        var i = {};
        if (window.__userInfo) {
          var e = window.__userInfo;
          i.uid = e.userId, i.sessionId = e.token, i.userName = e.user.username, i.domainId = e.domainId
        }
        $.trackBI({
          bid: "webHuoZhu",
          label: t
        }, {
          ENV: window.__ENV,
          scriptStartTime: window.__scriptStartTime,
          scriptEndTime: window.__scriptEndTime,
          params: i
        })
      },
      backLogin: function() {
        var t = $.cookie("routeLogin");
        t = t || "login", window.location.href = t
      }
    };
  return s
})
