define(function(require, exports, module) {
  var a = {
    opts: {
      idName: "js_gulp_dialog",
      html: "",
      isMaskClose: true,
      complete: null
    },
    init: function(t) {
      $.extend(a.opts, t), a.render(), a.event(), a.upSite(), "function" == typeof a.opts.complete && a.opts.complete($("#" + a.opts.idName))
    },
    close: function() {
      var t = $("#" + a.opts.idName);
      t.remove()
    },
    render: function() {
      a.close(), $("body").append(a.getTpl())
    },
    event: function() {
      a.opts.isMaskClose && $("#" + a.opts.idName).on("click", ".js_gulp_dialog_mask", function() {
        a.close()
      })
    },
    upSite: function() {
      var t = $("#" + a.opts.idName),
        i = t.find(".js_gulp_dialog_content");
      setTimeout(function() {
        var t = 0,
          e = 0;
        t = i.width(), e = i.height(), i.css({
          "margin-left": "-" + t / 2 + "px",
          "margin-top": "-" + e / 2 + "px"
        })
      }, 0)
    },
    getTpl: function() {
      var t = "";
      return t += '<div id="' + a.opts.idName + '" class="dialog"><div class="dialog_mask js_gulp_dialog_mask"></div><div class="dialog_content js_gulp_dialog_content">' + a.opts.html + "</div></div>"
    }
  };
  return {
    init: a.init,
    close: a.close,
    upSite: a.upSite
  }
})
