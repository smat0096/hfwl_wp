define(function(require, exports, module) {
  var 
    e = require("commonBase"),
    n = e.common,
    s = e.cityPlug,
    o = e.txt,
    r = e.setData,
    l = require("./common"),
    //vueFindVm = require("./ks_find.js"),
    d = {
      container: $("#JS_find_list"),
      prama: {
        fromId: null,
        toId: null,
        maxId: -1,
        minId: -1
      },
      _loadImg: function(t) {
        if (t.attachmentFolderUrl) {
          var i = t.attachmentFolderUrl + "/figure.jpg!200",
            a = new Image;
          a.onload = function() {
            setTimeout(function() {
              $("#init_" + t.id).find(".list_avator").html("<img src=" + i + ">")
            }, 0)
          }, a.src = i
        }
      },
      _getTpl: function(t) {
        var i = [],
          a = [],
          e = l.formateDate(t.createTime, true),
          s = null;
        t.registerTime && (s = n._getDateDiff(t.registerTime)), t.cargoTypeName && a.push(t.cargoTypeName), t.vehicleTypeName && a.push(t.vehicleTypeName), t.load && a.push(t.load);
        var o = a.join("/");
        i.push('<div class="list_item" data-id=' + t.id + " id=init_" + t.id + ">"), i.push('<div class="list_avator">');
        var r = t.userDisplayName.slice(0, 1);
        return i.push('<span class="img_span">' + r + "</span>"), i.push("</div>"), i.push('<div class="list_info">'), i.push(' <div class="list_info_right">'), i.push('   <p class="time">' + e + "</p>"), i.push('   <i class="icon_find_phone" title="拨打电话" data-id=' + t.id + "></i>"), i.push(" </div>"), i.push('  <div class="list_info_left">'), i.push("    <div>"), i.push('     <span class="address_name">' + t.from + "</span>"), i.push('      <i class="icon_find_arrow"></i>'), i.push('     <span class="address_name">' + t.to + "</span>"), i.push("    </div>"), i.push('    <p class="p1">' + o + "</p>"), i.push('   <p class="p2">'), i.push("      <span>" + t.userDisplayName + "</span>"), i.push('      <i class="icon_find_renzheng"></i>'), s && i.push('     <span class="icon_find_alarm">已注册' + s + "</span>"), i.push('     <span class="icon_find_square">发货' + t.sendCount + "条</span>"), i.push("    </p>"), i.push("  </div>"), i.push("</div>"), i.push("</div>"), i.join("")
      },
      isAutoTop: true,
      no_Session: false,
      timer: 15e3,
      visitorId: null,
      scrollTime: 500
    },
    c = {
      list: [],
      waitlist: [],
      limit: 300,
      addData: function(t) {
        if (t.content && t.content.messages.length > 0)
          for (var i = t.content.messages, a = i.length - 1; a >= 0; a--) {
            var e = i[a];
            this.waitlist.unshift(e)
          }
      },
      addHistoryData: function(t) {
        if (t.content && t.content.messages.length > 0)
          for (var i = t.content.messages, a = 0, e = i.length; e > a; a++) {
            var n = i[a];
            this.list.push(n)
          }
      },
      resetData: function() {
        if (c.list.length > c.limit)
          for (var t = c.list.length - c.limit; t > 0;) {
            var i = c.list.pop();
            $("#init_" + i.id).remove(), t--
          }
      },
      resetList: function() {
        this.list.length = 0, this.waitlist.length = 0
      }
    },
    _ = function() {
      this.timeId = null, this.status = 0, this.first = true
    };
  $.extend(_.prototype, {
    run: function() {
      var t = this;
      0 != c.waitlist.length && (t.first ? (t.first = false, t.loadAll(), t._isTop(), t.run()) : t.timeId = setTimeout(function() {
        var i = c.waitlist.pop();
        htmlStr = t._getTpl(i), d.container.prepend(htmlStr), d._loadImg(i), t.follow(), t._isTop(true), c.list.unshift(i), t.run()
      }, 2e3))
    },
    _isTop: function(t) {
      d.isAutoTop && (t ? d.container.stop().animate({
        scrollTop: "0px"
      }, d.scrollTime) : d.container.scrollTop(0))
    },
    follow: function(t) {
      t = t || 1;
      var i = d.container.scrollTop();
      i += 87 * t;
      var a = 87 * (c.limit - 10);
      i >= a || d.container.scrollTop(i)
    },
    loadAll: function() {
      for (; c.waitlist.length > 0;) {
        var t = c.waitlist.pop(),
          i = d._getTpl(t);
        d.container.prepend(i), c.list.unshift(t), d._loadImg(t), this.follow()
      }
    },
    start: function() {
      this.status = 0, this.run()
    },
    stop: function() {
      var t = this;
      clearTimeout(t.timeId)
    },
    _getTpl: function(t) {
      return d._getTpl(t)
    },
    reset: function() {
      this.status = 0, this.first = true
    }
  });
  var m = {
    lx_first: true,
    timeId: null,
    lx_timeId: null,
    _init: function(t) {
      d = $.extend(d, t), 
      //this._event(), 
      this._initChoose(), 
      //this._initList(), 
      this.loader = new _
    },
    //ks change 更改选择自动滚屏
    _event: function() {
      var t = this;
      $("#JS_get_goods").on("click", function() {
        var t = $(this);
        t.hasClass("checked") ? (t.removeClass("checked"), d.isAutoTop = false) : (t.addClass("checked"), d.isAutoTop = true)
      }), 
      d.container.on("scroll", function() {
        t._scorllLoad()
      })
    },
    _initChoose: function() {
      var //i = this, 
        a = function(t) {
          var a = $("#js_from_btn .js_c_inp").val(),
            e = $("#js_to_btn .js_c_inp").val(),
            n = $("#js_car_btn .js_c_inp").val();
          "不限" == n && (n = "");
          //i._initList(a, e, n);
          //地址选择器回调函数 ks_change 2017/03/14
          var f = window.ks_formData;
          vueFindVm.filterData = {
            'fromId' : a,
            'toIds' : f.toData && f.toData.id,
            'vehicleLengthName' : f.choseCarLData,
            'vehicleTypeName': f.choseCarTData
          }
        };
      require.async("site", function(t) {
        s.init({
          site: t,
          TXT: o,
          SetData: r,
          plugBox: $("#js_city_plug"),
          carCallBack: a,
          toCallBack: a,
          fromCallBack: a,
          tpl: true,
          fromIndex: 2,
          toIndex: 2
        })
      }), 
      require.async("siteHash", function(t) {
        var i, a;
        i = window.__userInfo ? window.__userInfo.user.regionId : d.visitorId;
        var e = String(i);
        //console.log(d.visitorId)
        //初始化地址
        i = parseInt(e.slice(0, 4));
        a = t[i];
        $("#js_from_btn .js_c_txt").eq(0).text(a);
        $("#js_from_btn .js_c_inp").eq(0).val(i);
          vueFindVm.filterData = {
            'fromId' : i,
            'toIds' : [],
            'vehicleLengthName' : '',
            'vehicleTypeName': ''
          }
          //Vue.set(vueFindVm.filterData, 'fromId', i)
      })
    },
    _initList: function(t, i, a) {
      var e = this;
      this._resetList(), t && (d.prama.fromId = t), i && (d.prama.toId = i), a && (d.prama.keyo = a), e._addListFirst().always(function(t) {
        if ("ERROR" == t.status && "100090" == t.errorCode) {
          var i = '<div class="def_box"><p style="color:#92979e;">' + t.errorMsg + '</p><p class="txt_center mt_5"><a href="javascript:;" class="btn js_go_login">登录</a></p>';
          return void d.container.html(i)
        }
        if ("ERROR" == t.status && "120002" == t.errorCode) {
          var i = '<div class="def_box"><p style="color:#92979e;">' + t.errorMsg + "</p></div>";
          return void d.container.html(i)
        }
        e._addList(t)
      })
    },
    _addListFirst: function() {
      var t = this;
      return d.container.addClass("loading_bg"), n.post(d.url, d.prama, function(i) {
        if (d.container.removeClass("loading_bg"), "OK" == i.status && i.content.messages.length > 0) c.addData(i), t.loader.start();
        else {
          var a = '<div class="def_box"><p style="color:#92979e;">该路线货源已被抢完</p></div>';
          d.container.html(a)
        }
      }, {
        no_Session: d.no_Session
      }).complete(function() {
        d.container.removeClass("loading_bg")
      })
    },
    _addList: function() {
      var t = this,
        i = d.timer;
      t.lx_first && (t.lx_first = false, i = 5e3), t.lx_timeId = setTimeout(function() {
        if (c.list.length > 0) {
          var i;
          i = c.list[0];
          var a = {
            maxId: i.id,
            minId: -1
          };
          d.prama = $.extend(d.prama, a)
        }
        n.post(d.url, d.prama, function(i) {
          n.loading.hide(), "OK" == i.status && i.content.messages.length > 0 && (t.clear_empty(), t.loader.stop(), t.loader.loadAll(), t.loader._isTop(), c.resetData(), c.addData(i), t.loader.start())
        }, {
          no_Session: d.no_Session,
          no_win: true
        }).always(function(i) {
          i.errorCode && "120001" == i.errorCode || "120002" == i.errorCode || "5" == i.errorCode || (t.lx_timeId = setTimeout(function() {
            m._addList()
          }, d.timer))
        })
      }, i)
    },
    show_tips: function(t) {
      t = t || "暂时没有新货源", $("#JS_get_tips").html(t).show().delay(2e3).fadeOut(1e3)
    },
    clear_empty: function() {
      $(".def_box").length && $(".def_box").remove()
    },
    _scorllLoad: function() {
      var t = this;
      clearTimeout(t.timeId), t.timeId = setTimeout(function() {
        t._isLoad() && t._addHistoryList()
      }, 300)
    },
    _isLoad: function() {
      if (0 != c.list.length) {
        var t = d.container.height(),
          i = d.container.scrollTop(),
          a = $(".list_item").last().get(0).offsetTop + 70;
        return i + t - a >= 0 ? true : false
      }
    },
    _addHistoryList: function() {
      var t = this,
        i = {
          maxId: -1,
          minId: c.list[c.list.length - 1].id
        };
      d.prama = $.extend(d.prama, i), n.post(d.url, d.prama, function(i) {
        "OK" == i.status && i.content.messages.length > 0 && (c.addHistoryData(i), t._renderHistory(i))
      })
    },
    _renderHistory: function(t) {
      for (var i = t.content.messages, a = 0, e = i.length; e > a; a++) {
        var n = i[a],
          s = d._getTpl(n);
        d.container.append(s), d._loadImg(n)
      }
    },
    _resetList: function() {
      d.container.empty(), clearTimeout(m.lx_timeId), c.resetList(), m.lx_first = true, d.prama.maxId = -1, d.prama.minId = -1, d.prama.keyo = "", m.loader && m.loader.reset()
    }
  };
  return {
    init: function(t) {
      m._init(t)
    }
  }
})
