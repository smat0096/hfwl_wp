define(function(require, exports, module) {
  var a, s = {
      label: require("./tpl/label")
    },
    o = require("./squareOverlay"),
    n = [],
    l = null;
  template.helper("$Getdate", function(t) {
    var i = "MM-dd hh:mm";
    return c.format(t, i) || ""
  }), template.helper("$getImage", function(t, i, e) {
    var a = c.getImageURL(t, i, e);
    return a = a.replace(/&lt;/g, "<"), a = a.replace(/&gt;/g, ">")
  });
  var c = {
    initMap: function(t) {
      a = new BMap.Map(t, {
        minZoom: 6,
        maxZoom: 20,
        enableMapClick: false
      }), window.lmap = a
    },
    getUserPosition: function(t, i) {
      var e = this,
        s = new BMap.Point(t[0], t[1]);
      a.centerAndZoom(s, 12), a.enableScrollWheelZoom(true);
      var o = {
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_ZOOM,
        enableGeolocation: true,
        offset: new BMap.Size(10, 80)
      };
      a.addControl(new BMap.NavigationControl(o)), a.enableDragging(), e.dragend(a, i);
      var n = e.getArea();
      return n
    },
    dragend: function(t, i) {
      var e = this;
      t.addEventListener("dragend", function(t) {
        if (i && "function" == typeof i) {
          var a = e.getArea();
          i(a)
        }
      })
    },
    getArea: function() {
      var t = {},
        i = a.getBounds();
      return t.minLat = i.Ie, t.maxLat = i.De, t.minLng = i.Je, t.maxLng = i.Ee, t
    },
    markCenter: function(t) {
      var i = new BMap.Point(t[0], t[1]);
      a.centerAndZoom(i, 16)
    },
    getPosition: function(t) {
      return $.ajax({
        type: "get",
        url: "https://api.map.baidu.com/location/ip?v=2.0&ak=Q0O9mkEqXfiLRRfVLUl7sHDZ&coor=bd09ll",
        dataType: "jsonp",
        success: function(i) {
          t && "function" == typeof t && t(i.content)
        }
      })
    },
    addMark: function(t, i, e, s) {
      var o = this,
        l = [],
        c = i.length;
      if (a.clearOverlays(), n && n.length)
        for (var r = 0, d = n.length; d > r; r++) n[r].hide();
      var p = new BMap.Icon(t, new BMap.Size(30, 35), {
        infoWindowAnchor: new BMap.Size(21.5, 0)
      });
      if (c)
        for (var r = 0; c > r; r++) {
          var h = i[r],
            u = new BMap.Marker(new BMap.Point(h.lng, h.lat), {
              icon: p
            });
          a.addOverlay(u), l.push(u), o.boundEvent(r, h, u, e, s)
        }
    },
    boundEvent: function(t, i, e, l, c) {
      var r = this;
      e.addEventListener("click", function(t) {
        var e = [];
        e[0] = t.currentTarget.point.lng, e[1] = t.currentTarget.point.lat, r.markCenter(e);
        var d = template.compile(s.label)({
          data: i
        });
        d = d.replace(/&#60;/g, "<").replace(/&#62;/g, ">").replace(/&#34;/g, "'");
        var p = d,
          h = $.extend(l, {
            map: a,
            center: {
              lng: e[0],
              lat: e[1]
            },
            template: p
          }),
          u = o.init(h);
        n.push(u), c && "function" == typeof c && c(u, i)
      })
    },
    getAddress: function(t, i, e) {
      var a = new BMap.Map(t, {
          minZoom: 6,
          maxZoom: 20
        }),
        s = new BMap.Geocoder,
        o = new BMap.Point(i.lng, i.lat),
        n = new BMap.Icon(window.DOMAIN_BASE + "/images/new_map_icon.png", new BMap.Size(300, 157));
      a.centerAndZoom(o, 18), a.enableScrollWheelZoom(true);
      var l = new BMap.Marker(o, {
        icon: n
      });
      a.addOverlay(l), l.enableDragging(), l.addEventListener("dragend", function(t) {
        s.getLocation(t.point, function(t) {
          var i = t.addressComponents,
            a = i.province + i.city + i.district + i.street + i.streetNumber;
          e && "function" == typeof e && e(a)
        })
      })
    },
    getDistance: function(t, i, e) {
      var a = new BMap.Map(t),
        s = new BMap.Point(i.lat, i.lng),
        o = new BMap.Point(e.lat, e.lng),
        n = a.getDistance(s, o);
      return n
    },
    getCityCenter: function(t, i) {
      var e = new BMap.Map(t),
        a = new BMap.Geocoder;
      a.getPoint(i, function(t) {
        if (t) {
          var i = e.getCenter();
          return i
        }
      })
    },
    searchRoute: function(t, i, e, a, s) {
      var o = this;
      l || (l = new BMap.Map(t, {
        minZoom: 6,
        maxZoom: 20,
        enableMapClick: false
      }), l.enableScrollWheelZoom(true)), l.clearOverlays();
      var n = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS],
        c = function(t) {
          if (r.getStatus() != BMAP_STATUS_SUCCESS) return void o.getPosition(function(t) {
            l.centerAndZoom(new BMap.Point(t.point.x, t.point.y), 12)
          });
          var i = t.getPlan(0);
          s && "function" == typeof s && s(i)
        },
        r = new BMap.DrivingRoute(l, {
          renderOptions: {
            map: l,
            autoViewport: true
          },
          onSearchComplete: c,
          policy: n[a]
        });
      r.clearResults(), r.search(i, e), l.clearOverlays()
    },
    searchDistance: function(t, i, e, a, s) {
      var o = new BMap.Map(t, {
          minZoom: 6,
          maxZoom: 20
        }),
        n = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS],
        a = n[a],
        l = function(t) {
          if (c.getStatus() == BMAP_STATUS_SUCCESS) {
            var i = t.getPlan(0);
            s && "function" == typeof s && s(i)
          }
        },
        c = new BMap.DrivingRoute(o, {
          onSearchComplete: l,
          policy: a
        });
      c.search(i, e)
    },
    format: function(t, i) {
      t = parseInt(t) || new Date, i = i || "yyyy-MM-dd";
      var e = new Date(t),
        a = {
          "M+": e.getMonth() + 1,
          "d+": e.getDate(),
          "h+": e.getHours(),
          "m+": e.getMinutes(),
          "s+": e.getSeconds(),
          "q+": Math.floor((e.getMonth() + 3) / 3),
          S: e.getMilliseconds()
        };
      /(y+)/.test(i) && (i = i.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (var s in a) new RegExp("(" + s + ")").test(i) && (i = i.replace(RegExp.$1, 1 == RegExp.$1.length ? a[s] : ("00" + a[s]).substr(("" + a[s]).length)));
      return i
    },
    getImageURL: function(t, i, e) {
      var a = this,
        s = "http://wlqq4driver.b0.upaiyun.com",
        o = ".jpg!80W",
        n = "";
      if (e) {
        if (a.hasFigurePhoto(i)) return n = s + "/" + e + "/figure" + o, n = '<img src="' + n + '"/>';
        if (a.hasFullShotPhoto(i)) return n = s + "/" + e + "/full-shot-photo" + o, n = '<img src="' + n + '"/>';
        if (a.hasVehicleSide(i)) return n = s + "/" + e + "/vehicle-side" + o, n = '<img src="' + n + '"/>';
        if (a.hasVehicleBehind(i)) return n = s + "/" + e + "/vehicle-behind" + o, n = '<img src="' + n + '"/>'
      }
      return n = '<span class="user_img">' + t.substr(0, 1) + "</span>"
    },
    hasFigurePhoto: function(t) {
      return (t & 1 << 22) > 0
    },
    hasFullShotPhoto: function(t) {
      return (4096 & t) > 0
    },
    hasVehicleSide: function(t) {
      return (16384 & t) > 0
    },
    hasVehicleBehind: function(t) {
      return (32768 & t) > 0
    }
  };
  return c
})
