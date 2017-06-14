define(function() {
  var e = {
    nowTime: null,  
    formateDate: function(t, i) {
      var a = new Date(t);
      if (year = a.getFullYear(), month = a.getMonth() + 1, day = a.getDate(), hh = a.getHours(), mm = a.getMinutes(), ss = a.getSeconds(), str = "", str += year + "-", month < 10 && (str += "0"), str += month + "-", day < 10 && (str += "0"), str += day + " ", hh < 10 && (str += "0"), str += hh + ":", mm < 10 && (str += "0"), str += mm, a = null, i && !e.nowTime && (e.nowTime = e._getNowTime()), i && e.nowTime) {
        var n = new RegExp(e.nowTime);
        str = n.test(str) ? str.replace(e.nowTime, "") : str.slice(5)
      }
      return str
    },
    _getNowTime: function() {
      var t = new Date;
      year = t.getFullYear(), month = t.getMonth() + 1, day = t.getDate(), month < 10 && (month = "0" + month), day < 10 && (day = "0" + day);
      var i = year + "-" + month + "-" + day;
      return i
    }
  };
  return e
})
