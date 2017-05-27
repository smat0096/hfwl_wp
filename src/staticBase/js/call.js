define(function(require, exports, module) {
  var a = require("./common"),
    s = require("./dialog/floor.js"),
    o = require("./dialog/dialog.js"),
    n = {
      call: require("./tpl/call")
    },
    l = {
      target_1: null,
      target_2: null,
      _init: function(t, i, e) {
        this._renderTpl(t, e), this._event(t, i, e), this._getUserMoney()
      },
      _renderTpl: function(t, i) {
        var e = template.compile(n.call)({
          data: t,
          userInfo: window.__userInfo,
          opt: i
        });
        s.init({
          html: e,
          complete: function() {},
          closeCallback: function() {}
        })
      },
      _event: function(t, i, e) {
        var a = this;
        a.target_1 = $("#JS_call_other .checked"), a.target_2 = $("#JS_call_user .checked"), a._choose($("#JS_call_other"), a.target_1), a._choose($("#JS_call_user"), a.target_2), $("#JS_call_make").on("click", function() {
          var s = $(this);
          s.hasClass("btn_unable") || a._submit(s, t, i, e)
        }), $("#JS_call_protocol").on("click", function() {
          a._protocol($(this))
        }), $("#JS_see_protocol").on("click", function() {
          a._seeProtocol()
        }), $("#JS_call_cancel").on("click", function() {
          s.close()
        })
      },
      _protocol: function(t) {
        submit_btn = $("#JS_call_make"), t.hasClass("checked") ? (t.removeClass("checked"), submit_btn.addClass("btn_unable")) : (t.addClass("checked"), submit_btn.removeClass("btn_unable"))
      },
      _seeProtocol: function() {
        window.parent.open("/VOIP")
      },
      _choose: function(t, i, e) {
        t.on("click", "li", function() {
          var t = $(this);
          t.hasClass("checked") || (t.addClass("checked"), i.removeClass("checked"), i = t, e && "function" == typeof e && e(i))
        })
      },
      _submit: function(t, i, e, n) {
        s.close();
        var l = this;
        if (e = e || "CAMCM", n && n.carPhone) var c = window.SERVER_VOIP + "/web/voip/request-callback.do",
          r = {
            fromSerNum: $("#JS_call_user .checked").data("mobile"),
            mobileIdx: $("#JS_call_other .checked").data("mobile"),
            sourceId: i.id,
            sourceType: e
          };
        else var c = window.SERVER_VOIP + "/web/voip/request-callback-mobile.do",
          r = {
            userId: window.__userInfo.userId,
            domainId: window.__userInfo.domainId,
            called: $("#JS_call_other .checked").data("mobile"),
            caller: $("#JS_call_user .checked").data("mobile"),
            sourceId: i.id,
            sourceType: e
          };
        n && "function" == typeof n.fn && n.fn(i), t.addClass("btn_unable"), a.post(c, r, function(t) {
          if ("OK" == t.status) {
            var i = t.content.id;
            l.call_success(i)
          } else if ("ERROR" == t.status && t.errorMsg) {
            var e = '<div class="call_win" style="height: 180px;width: 300px;"><div class="call_win_cont" style="height: 129px;width:300px;text-align: center;display: table-cell;vertical-align: middle;padding: 0 10px;"><span>' + t.errorMsg + '</span></div><div class="call_win_footer"><a href="javascript:;" class="blue js_call_close_2">确定</a></div></div>';
            o.init({
              html: e,
              complete: function() {
                $(".call_win .js_call_close_2").on("click", function() {
                  o.close()
                })
              }
            })
          }
        }).complete(function() {
          t.removeClass("btn_unable")
        })
      },
      call_success: function(t) {
        var i = null,
          e = function() {
            clearTimeout(i)
          },
          n = function() {
            i = setTimeout(function() {
              var e = window.SERVER_VOIP + "/web/voip/get-call-status.do",
                s = {
                  id: t
                };
              a.post(e, s, function(t) {
                "OK" == t.status && "Hangup" == t.content.status && l.call_over(t)
              }, {
                no_win: true
              }).always(function(t) {
                t && t.content && "Hangup" == t.content.status || t.errorCode && "120001" == t.errorCode || "120002" == t.errorCode || "5" == t.errorCode || "20462002" == t.errorCode || (i = setTimeout(function() {
                  n()
                }, 2e3))
              })
            }, 2e3)
          };
        s.close();
        var c = '<div class="call_win" style="height: 180px;width: 300px;"><div class="call_win_cont" style="padding:32px 0;height:auto;"><p>正在拨打中，请稍后。。。</p><p>接通后请不要挂断，稍后系统将自动拨</p><p>打司机电话</p></div><div class="call_win_footer"><a href="##" class="blue js_call_close">关闭</a></div></div>';
        o.init({
          html: c,
          isMaskClose: false,
          complete: function() {
            n(), $(".call_win .js_call_close").on("click", function() {
              e(), o.close();

            })
          }
        })
      },
      call_over: function(t) {
        var i = t.content.cost,
          e = l.transTime(1e3 * t.content.duration);
        o.close();
        var a = '<div class="call_win" style="height: 180px;width: 300px;"><div class="call_win_cont"><p style="padding-top:50px;">通话时长：' + e + "</p><p>消费：" + i + '元</p></div><div class="call_win_footer"><a href="##" class="blue js_call_close">我知道了</a></div></div>';
        o.init({
          html: a,
          complete: function() {
            $(".call_win .js_call_close").on("click", function() {
              o.close()
            })
          }
        })
      },
      _getUserMoney: function() {
        if (window.__userInfo) {
          var t = window.SERVER_AMS + "/web/ams/user/service/get.do",
            i = {
              userId: window.__userInfo.userId,
              domainId: window.__userInfo.domainId,
              catalogId: 15
            };
          a.post(t, i, function(t) {
            if ("OK" == t.status && t.content) {
              {
                t.content.remainingAmount || 0
              }
              $("#JS_call_sum").html("余额:" + t.content.remainingAmount + "元")
            }
          }, {
            no_win: true
          })
        }
      },
      transTime: function(t) {
        t = parseInt(t / 1e3, 10);
        var i = Math.floor(t / 3600),
          e = t % 3600,
          a = Math.floor(e / 60),
          s = e % 60,
          o = "";
        return o = i ? i + "小时" + a + "分" + s + "秒" : a + "分" + s + "秒"
      }
    };
  exports.phoneCall = function(t, i, e) {
    l._init(t, i, e)
  }
})
