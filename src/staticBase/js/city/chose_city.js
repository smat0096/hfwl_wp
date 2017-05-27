define(function(require, exports, module) {
  var a = function(t) {
    var i = {
      allWhole: false,
      isProvince: false,
      isCity: false,
      zIndexData: 3,
      limit: 0
    };
    this.opts = $.extend({}, i, t || {}), this.init()
  };
  a.prototype.init = function() {
    this.firstHtml = "", this.twoHtml = "", this.curType = 1, this.twoArr = [], this.threeArr = [], this.backObj = {
      id: [],
      name: []
    }, this.oTab = this.opts.oBox.find(".js_table"), this.oName = this.opts.oBox.find(".js_name"), this.oBack = this.opts.oBox.find(".js_back"), this.ohistory = this.opts.oBox.find(".js_history"), this.bind()
  }, a.prototype.bind = function() {
    this.opts.oTrigger.on("click", $.proxy(this.showFirst, this)), this.oTab.on("click", "p", $.proxy(this.showOther, this)), this.oBack.on("click", $.proxy(this.showBack, this)), this.ohistory.on("click", "li", $.proxy(this.delHistory, this))
  }, a.prototype.layer = function(t) {
    $("#JS_layer_box").length > 0 && $("#JS_layer_box").remove();
    var i = t || "错误提示信息",
      e = $('<div class="layer_box" id="JS_layer_box">' + i + "</div>");
    $("body").append(e), setTimeout(function() {
      e.remove()
    }, 3e3)
  }, a.prototype.showTxt = function() {
    var t = this.opts.oBox.find(".js_city_txt");
    1 == this.curType ? t.hide().eq(0).show() : t.hide().eq(1).show()
  }, a.prototype.showBack = function() {
    var t = "";
    this.curType--, 1 == this.curType ? t = this.firstHtml : 2 == this.curType && (t = this.twoHtml), this.oTab.html(t), this.showTxt()
  }, a.prototype.setData = function(t, i) {
    this.opts.oTrigger.find(".js_city_name").html(t), this.opts.oTrigger.find(".js_city_id").val(i)
  }, a.prototype.showData = function(t) {
    if (t) {
      for (var i = "", e = [], a = 0, s = t.length; s > a; a++) {
        var o = t[a];
        e[o.id] = {}, e[o.id].data = o.city || o.area || {}, e[o.id].name = o.name, e[o.id].html = "", i += this.opts.zIndexData == this.curType || 3 == this.curType || 0 == e[o.id].data.length ? '<td><p data-id="' + o.id + '" class="close">' + o.name + "</p></td>" : '<td><p data-id="' + o.id + '">' + o.name + "</p></td>";
        var n = a;
        n += 1 == this.curType && !this.opts.allWhole || 2 == this.curType && !this.opts.isProvince || 3 == this.curType && !this.opts.isCity ? 2 : 1, n % 4 == 0 && a > 0 && (i += "</tr><tr>")
      }
      return {
        str: i,
        arr: e
      }
    }
  }, a.prototype.showFirst = function(t) {
    if (!this.firstHtml) {
      this.firstHtml += "<tr>", this.opts.allWhole || (this.firstHtml += '<td><p data-type="all" data-id="-1" class="close">全国</p></td>');
      var i = this.showData(this.opts.data);
      this.twoArr = i.arr, this.firstHtml += i.str, this.firstHtml += "</tr>"
    }
    this.curType = 1, this.showTxt(), this.allDataArr = [], this.oTab.html(this.firstHtml), t.stopPropagation()
  }, a.prototype.showOther = function(t) {
    var i = $(t.currentTarget),
      e = i.data("id"),
      a = i.prop("lastChild").nodeValue,
      s = [],
      o = {};
    if (this.oName.html(a), i.hasClass("no_data") || (this.allDataArr[this.curType - 1] = {
        id: e,
        name: a
      }), i.hasClass("close")) {
      var n = {};
      this.opts.limit > 0 ? (this.history(e, a), n = this.backObj) : n = {
        id: e,
        name: a
      }, this.setData(a, e), this.opts.callBack && "function" == typeof this.opts.callBack && this.opts.callBack(n, this.allDataArr)
    } else 1 == this.curType ? (this.curType = 2, s = this.twoArr[e], o = this.showData(s.data), this.threeArr = o.arr, s.html || (s.html += "<tr>", this.opts.isProvince || (s.html += '<td><p class="close no_data" data-id="' + e + '"><span>全</span>' + s.name + "</p></td>"), s.html += o.str, s.html += "</tr>"), this.twoHtml = s.html) : 2 == this.curType && (this.curType = 3, s = this.threeArr[e], s.html || (s.html += "<tr>", this.opts.isCity || (s.html += '<td><p class="close no_data" data-id="' + e + '"><span>全</span>' + s.name + "</p></td>"), o = this.showData(s.data), s.html += o.str, s.html += "</tr>")), this.showTxt(), this.oTab.html(s.html), t.stopPropagation()
  }, a.prototype.inArray = function(t, i) {
    for (var e = 0; e < i.length; e++)
      if (i[e] == t) return true;
    return false
  }, a.prototype.history = function(t, i) {
    var e = this.backObj.id.length,
      a = "";
    if (e && this.inArray(t, this.backObj.id)) return void this.layer("当前地区已选择");
    if (e >= this.opts.limit) return void this.layer("到达地最多是" + this.opts.limit + "条");
    if (this.backObj.id.indexOf(-1) >= 0) return void this.layer("已选择了全国");
    if (-1 == t) this.backObj.id = [], this.backObj.name = [];
    else if (e)
      for (var s = [], s = s.concat(this.backObj.id), o = "", n = "" + t, l = 0; e > l; l++)
        if (o = "" + s[l], 0 == o.indexOf(n)) {
          var c = this.backObj.id.indexOf(o);
          this.backObj.id.splice(c, 1), this.backObj.name.splice(c, 1)
        } else if (0 == n.indexOf(o)) return void this.layer("已选择了" + this.backObj.name[l]);
    this.backObj.id.push(t), this.backObj.name.push(i), e = this.backObj.id.length;
    for (var l = 0; e > l; l++) a += '<li data-id="' + this.backObj.id[l] + '">' + this.backObj.name[l] + "</li>";
    this.ohistory.find("ul").html(a)
  }, a.prototype.delHistory = function(t) {
    var i = $(t.target),
      e = i.data("id"),
      a = this.backObj.id.indexOf(e);
    this.backObj.id.splice(a, 1), this.backObj.name.splice(a, 1), i.remove()
  }, Array.prototype.indexOf = function(t) {
    for (var i = 0, e = this.length; e > i; i++)
      if (this[i] === t) return i;
    return -1
  }, exports.init = function(t) {
    return new a(t)
  }
})
