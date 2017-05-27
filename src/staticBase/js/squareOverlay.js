define(function(require, exports, module) {
  function a(t) {
    this._center = t.center, this._length = t.length, this._height = t.height, this._map = t.map, this._template = t.template, this.initialize()
  }
  window.BMap && (a.prototype = new BMap.Overlay), $.extend(a.prototype, {
    initialize: function() {
      var t = this;
      this._map.addEventListener("moveend", function() {
        t.remove(), t.hide()
      });
      var i = document.createElement("div");
      return i.style.width = this._length + "px", i.style.height = this._height + "px", i.innerHTML = "", i.innerHTML = this._template, this._map.getPanes().markerPane.appendChild(i), i.style.position = "absolute", this._div = i, t.draw(), i
    },
    draw: function() {
      var t = this._map.pointToOverlayPixel(this._center);
      this._div.style.left = t.x - this._length / 2 + "px", this._div.style.top = t.y - this._height - 20 + "px"
    },
    show: function() {
      this._div && (this._div.style.display = "block")
    },
    hide: function() {
      this._div && (this._div.style.display = "none")
    },
    remove: function() {
      this._map.removeOverlay(this._div)
    },
    addEventListener: function(t, i) {
      this._div["on" + t] = i
    }
  }), exports.init = function(t) {
    return new a(t)
  }
})