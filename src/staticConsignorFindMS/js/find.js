define(function(require, exports, module) {
  var e = require("commonBase");
  var n = e.common,
    s = e.call,
    o = e.map,
    r = e.dialog,
    l = require("find/findCommon"),
    d = require("find/sourseInfo"),
    c = require("plug/siteHashDo")
    _ = {
      _init: function() {
        this._renderMsgVisitor()
        //this._run(); //
        //this._event(); //事件
        //this._road(); //跑马灯公告加载
        var t = this;
        $(".find_goods").on("click",".JS_navigation", function() {
          t._chooseMap($(this))
        })
      },
      _run: function() {
        window.__userInfo ? this._renderMsgVip() : this._renderMsgVisitor()
      },
      _event: function() {
        var t = this;
        $("#JS_find_list")
        .on("click", ".icon_find_phone", function() {
          var i = $(this).data("id");
          return t._takePhone(i), false
        })
        .on("click", ".ks_list_item", function() {
          var i = $(this).data("id");
          t._showDetail(i)
        });
        $(".find_goods")
        .on("click",".JS_navigation", function() {
          t._chooseMap($(this))
        })
        .on("click", ".js_back_sourse", function() {
          t._hideDetail()
        })
        .on("click", ".js_back_map", function() {
          t._hideMap()
        })
        .on("click", ".JS_find_phone", function() {
          var i = $(this).data("id"),
            a = $(this).data("mobile"),
            e = $(this).data("userid");
          s.phoneCall({
            mobile: a,
            id: i,
            userId: e
          }, "", {
            fn: function(i) {
              t._recordCall(i)
            }
          })
        }).on("click", ".js_go_login", function() {
          n.goLogin()
        })
      },
      _renderMsgVip: function() {
        var t = window.__userInfo.user.regionId,
          i = String(t);
        t = parseInt(i.slice(0, 4)), l.init({
          url: window.SERVER_MS + "/web/message/cargo/search",
          prama: {
            fromId: t,
            toId: -1,
            maxId: -1,
            minId: -1,
            pageSize: 20
          }
        })
      },
      _renderMsgVisitor: function() {
        var t, i = {
          "北京北京": 11,
          "天津天津": 12,
          "上海上海": 13,
          "重庆重庆": 15
        };
        o.getPosition(function(a) {
          var e = a.address_detail.province.replace("省", ""),
            n = a.address,
            s = n.replace(/[市|省|]+/g, ""),
            s = s.replace("自治区", ""),
            s = s.replace("回族", ""),
            s = s.replace("壮族", ""),
            s = s.replace("维吾尔", ""),
            s = s.replace("地区", ""),
            s = s.replace("海南直辖县级行政单位", "");
          t = i[s] ? i[s] : c[s], t || (t = c[e]);
          var o = String(t);
          t = parseInt(o.slice(0, 4))
        })
        .then(function() {
          l.init({
            //url: window.SERVER_MS + "/web/message/cargo/visitor/search",
            prama: {
              fromId: t,
              toId: -1,
              maxId: -1,
              minId: -1,
              pageSize: 20
            },
            no_Session: true,
            visitorId: t
          })
        })
      },
      _takePhone: function(t) {
        var i = this,
          a = window.SERVER_MS + "/web/message/cargo/detail",
          e = {
            id: t
          };
        n.loading.show();
        n.post(a, e, function(t) {
          n.loading.hide(), "OK" == t.status ? s.phoneCall(t.content, "", {
            fn: function(t) {
              i._recordCall(t)
            }
          }) : "ERROR" == t.status && t.errorMsg && n.layer(t.errorMsg)
        }).complete(function() {
          n.loading.hide()
        })
      },
      _recordCall: function(t) {
        var i = window.SERVER_MS + "/web/msg/call/phone/add",
          a = {
            calledDomainId: window.__userInfo.domainId,
            calledUserId: t.userId,
            dialingUserPhone: $("#JS_call_user .checked").data("mobile"),
            calledUserPhone: $("#JS_call_other .checked").data("mobile"),
            msgId: t.id,
            callResult: 0,
            talkTime: 0,
            dialingLocation: window.__userInfo.user.regionId,
            calledLocation: "",
            remark: ""
          };
        n.post(i, a, function(t) {
          "OK" == t.status
        }, {
          no_win: true
        })
      },
      _showDetail: function(t) {
        d.init(t)

      },
      _hideDetail: function() {
        $(".js_tab_sourse").animate({
          left: "100%"
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
          left: "100%"
        }, function() {
          $("#JS_map_distance").html("此路线的里程大约为：--公里")
        })
      },
      _loadMap: function(t, i) {
        o.searchRoute("JS_content_map", t, i, 0, function(t) {
          //var i = parseFloat(t.cg / 1e3).toFixed(1);
          //var j = t.getDuration(true);//获取时间
          var k = t.getDistance(true);//获取距离
          $("#JS_map_distance").html("此路程的里路程大约为：" + k)
        })
      },
      _chooseMap: function(i) {
        var a = this,
          e = i.data("from"),
          n = i.data("to");
        n ? (a._showMap(), a._loadMap(e, n)) : t.async("siteHash", function(t) {
          for (var n = i.data("toids"), s = n.split(","), o = [], l = 0, d = s.length; d > l; l++) {
            var c = s[l];
            o.push(t[c])
          }
          console.log(o);
          var _ = 50 * (o.length + 1),
            m = [];
          m.push('<div class="call_win" style="width:300px;height:' + _ + 'px;">'), m.push('<p class="choose_title">请选择到达地</p>');
          for (var l = 0; l < o.length; l++) m.push('<p class="JS_map_choose" data-to=' + o[l] + ">" + o[l] + "</p>");
          m.push("</div>"), r.init({
            html: m.join(""),
            complete: function() {
              $(".call_win").on("click", ".JS_map_choose", function() {
                var t = $(this),
                  i = t.data("to");
                a._showMap(), a._loadMap(e, i), r.close()
              })
            }
          })
        })
      },
      _road: function() {
        function t() {
          n.scrollLeft >= a.scrollWidth ? n.scrollLeft = 0 : n.scrollLeft++
        }
        var i = 50,
          a = document.getElementById("js_road1"),
          e = document.getElementById("js_road2"),
          n = document.getElementById("road_box");
        if (a && e) {
          e.innerHTML = a.innerHTML;
          var s = setInterval(t, i);
          n.onmouseover = function() {
            clearInterval(s)
          }, n.onmouseout = function() {
            s = setInterval(t, i)
          }
        }
      }
    };
  exports.init = function() {
    // n.userLogin().then(function() {
    //   n._truckLoad("findGoods_onload"), 
    _._init()
    // })
  }
})
