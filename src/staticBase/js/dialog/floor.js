define(function(require, exports, module) {
  var a = {
    opts: {
      complete: null,
      html: "",
      animateOpenTime: 200,
      animateCloseTime: 100,
      idName: "js_gulp_dialog_floor",
      closeCallback: null,
      isMaskClose: true
    },
    init: function(t) {
      $.extend(a.opts, t), a.render(), a.event()
    },
    close: function() {
      var t = $("#" + a.opts.idName),
        i = t.length,
        e = $("#" + a.opts.idName + " .js_floor_content"),
        s = e.height();
      e.animate({
        bottom: "-" + s + "px"
      }, a.opts.animateCloseTime, function() {
        t.remove(), i && "function" == typeof a.opts.closeCallback && a.opts.closeCallback()
      })
    },
    render: function() {
      a.close(), $("body").append(a.getTpl());
      var t = $("#" + a.opts.idName + " .js_floor_content"),
        i = t.height();
      t.css({
        bottom: "-" + i + "px"
      }).show().animate({
        bottom: 0
      }, a.opts.animateTime, function() {
        "function" == typeof a.opts.complete && a.opts.complete()
      })
    },
    event: function() {
      a.opts.isMaskClose && $("#" + a.opts.idName).on("click", ".js_floor_mask", function() {
        a.close()
      })
    },
    getTpl: function() {
      var t = "";
      return t += '<div id="' + a.opts.idName + '" class="dialog_floor"><div class="floor_mask js_floor_mask"></div><div class="floor_content js_floor_content">' + a.opts.html + "</div></div>"
    }
  };
  return {
    init: a.init,
    close: a.close
  }
})
