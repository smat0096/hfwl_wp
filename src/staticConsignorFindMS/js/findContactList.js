define(function(require, exports, module) {
  var n = require("commonBase"),
    e = n.common,
    s = (n.call, require("./common")),
    o = {
      container: $("#JS_find_list"),
      _getTpl: function(a) {
        var t = [],
          i = [],
          n = s.formateDate(a.createTime, true);
        a.cargoTypeName && i.push(a.cargoTypeName), a.vehicleTypeName && i.push(a.vehicleTypeName), a.load && i.push(a.load);
        var e = i.join("/");
        t.push('<div class="list_item" data-id=' + a.id + " id=init_" + a.id + ">"), t.push('<div class="list_avator">');
        var o = a.userDisplayName.slice(0, 1);
        return t.push('<span class="img_span">' + o + "</span>"), t.push("</div>"), t.push('<div class="list_info">'), t.push(' <div class="list_info_right">'), t.push('   <p class="time">' + n + "</p>"), t.push('   <i class="icon_find_phone" title="拨打电话" data-id=' + a.id + "></i>"), t.push(" </div>"), t.push('  <div class="list_info_left">'), t.push("    <div>"), t.push('     <span class="address_name">' + a.from + "</span>"), t.push('      <i class="icon_find_arrow"></i>'), t.push('     <span class="address_name">' + a.to + "</span>"), t.push("    </div>"), t.push('    <p class="p1">' + e + "</p>"), t.push('   <p class="p2">'), t.push("      <span>" + a.userDisplayName + "</span>"), t.push('      <span class="icon_find_square">发货' + a.sendCount + "条</span>"), t.push("    </p>"), t.push("  </div>"), t.push("</div>"), t.push("</div>"), t.join("")
      }
    },
    r = {
      _init: function() {
        this.getDate()
      },
      getDate: function() {
        var a = this,
          t = window.SERVER_MS + "/web/msg/call/phone/serch",
          i = {
            pageNumber: 1,
            pageSize: 100,
            callResult: 0
          };
        return o.container.addClass("loading_bg"), e.post(t, i, function(t) {
          if (o.container.removeClass("loading_bg"), "OK" == t.status && t.content.elements.length > 0) a.render(t.content.elements);
          else {
            var i = '<div class="def_box"><p style="color:#92979e;">暂时没有联系货源记录</p></div>';
            o.container.html(i)
          }
          "ERROR" == t.status && t.errorMsg && e.layer(t.errorMsg)
        }).complete(function() {
          o.container.removeClass("loading_bg")
        })
      },
      render: function(a) {
        for (var t = 0, i = a.length; i > t; t++) {
          var n = a[t],
            e = o._getTpl(n);
          o.container.append(e), this._loadImg(n)
        }
      },
      _loadImg: function(a) {
        if (a.attachmentFolderUrl) {
          var t = a.attachmentFolderUrl + "/figure.jpg!200",
            i = new Image;
          i.onload = function() {
            setTimeout(function() {
              $("#init_" + a.id).find(".list_avator").html("<img src=" + t + ">")
            }, 0)
          }, i.src = t
        }
      }
    };
  exports.init = function() {
    r._init()
  }
})
