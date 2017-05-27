define(function(require, exports, module) {
  var o = function(t) {
    this.opts = t, this.oUl = this.opts.oBox.find("ul"), this.init()
  };
  o.prototype.init = function() {
    this.addData(), this.getData()
  }, o.prototype.addData = function() {
    for (var t = this.opts.data.length, i = "", s = 0; t > s; s++) i += "<li>" + this.opts.data[s] + "</li>";
    this.oUl.html(i)
  }, o.prototype.getData = function() {
    this.oUl.on("click", "li", $.proxy(function(t) {
      var i = $(t.target),
        s = i.text();
      i.addClass("s").siblings("li").removeClass("s"), this.opts.choseData = s, this.opts.callBack && "function" == typeof this.opts.callBack && this.opts.callBack(this.opts)
    }, this))
  }, exports.init = function(t) {
    return new o(t)
  }
});
