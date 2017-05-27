define(function(require, exports, module) {
  var a = function(t) {
    this.opts = t, this.multipleStatus = t.multipleStatus, this.oUl = this.opts.oBox.find("ul"), this.init()
  };
  a.prototype.init = function() {
    this.addData(), this.getData()
  }, a.prototype.addData = function() {
    for (var t = this.opts.data.length, i = "", e = 0; t > e; e++) i += "<li>" + this.opts.data[e] + "</li>";
    this.oUl.html(i)
  }, a.prototype.getData = function() {
    this.oUl.on("click", "li", $.proxy(function(t) {
      var i = $(t.target),
        e = i.text();
      this.opts.curObj = i, this.multipleStatus || i.addClass("s").siblings("li").removeClass("s"), this.opts.choseData = e, this.opts.callBack && "function" == typeof this.opts.callBack && this.opts.callBack(this.opts)
    }, this))
  }, exports.init = function(t) {
    return new a(t)
  }
})
