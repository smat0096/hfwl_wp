define(function(require, exports, module) {
  var a = require("./dialog"),
    s = {
      dialog: require("../tpl/dialog")
    },
    o = {
      show: function(t, i, e) {
        var o = template.compile(s.dialog)();
        t = t || o, a.init({
          html: t,
          complete: function() {
            e && "function" == typeof e && e(), $(".js_dialog_choose").off().on("click", function() {
              i(a, $(this))
            }), $(".js_dialog_close").off().on("click", function() {
              a.close()
            })
          }
        })
      }
    };
  exports.showDialog = function(t, i, e) {
    o.show(t, i, e)
  }
})