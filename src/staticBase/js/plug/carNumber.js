define(function(require, exports, module) {
  var a = require("./../dialog/floor"),
    s = {
      site: [
        ["京", "津", "沪", "渝", "冀", "豫"],
        ["鲁", "晋", "陕", "皖", "苏", "浙"],
        ["鄂", "湘", "赣", "闽", "粤", "桂"],
        ["琼", "川", "贵", "云", "辽", "吉"],
        ["黑", "蒙", "甘", "宁", "青", "新"],
        ["藏", "港", "澳", "台", "", ""]
      ],
      num: [
        ["A", "B", "C", "D", "E", "F"],
        ["G", "H", "J", "K", "L", "M"],
        ["N", "P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y", "Z"],
        ["0", "1", "2", "3", "4", "5"],
        ["6", "7", "8", "9", "", ""]
      ],
      maxLength: 7,
      minLength: 1
    },
    o = {
      opts: {
        lastTimeData: "",
        currentData: "",
        $input: null
      },
      init: function(t) {
        $.extend(o.opts, t), o.render(), o.renderMain(), o.event()
      },
      render: function() {
        a.init({
          html: o.getTpl()
        })
      },
      event: function() {
        var t = $("#js_plug_car_number");
        t.on("click", ".js_car_number_btn", function() {
          o.opts.currentData.length < s.maxLength && (o.opts.currentData += $(this).text(), t.find(".js_cn_display").text(o.opts.currentData), o.opts.currentData.length >= s.maxLength ? (o.close(), o.opts.$input.val(o.opts.currentData)) : o.opts.currentData.length <= s.minLength && o.renderMain())
        }).on("click", ".js_cancel", function() {
          o.close()
        }).on("click", ".js_delete", function() {
          var t = o.opts.currentData;
          o.opts.currentData = t.substring(0, t.length - 1), $(".js_cn_display").text(o.opts.currentData), o.opts.currentData.length < s.minLength && o.renderMain()
        })
      },
      close: function() {
        o.opts.lastTimeData = o.opts.currentData, a.close()
      },
      renderMain: function() {
        var t = "",
          i = o.opts.currentData ? s.num : s.site;
        t += "<table><tbody>";
        for (var e = 0, a = i.length; a > e; e++) {
          t += "<tr>";
          for (var n = 0, l = i[e].length; l > n; n++) t += '<td width="16.66%"><a href="javascript:;" class="js_car_number_btn">' + i[e][n] + "</a></td>";
          t += "</tr>"
        }
        t += "</tbody></table>", $(".js_cn_main").html(t)
      },
      getTpl: function() {
        var t = '<section id="js_plug_car_number" class="plug_car_number"><div class="top"><i class="top_left">·</i><i class="top_right">·</i><i class="bottom_left">·</i><i class="bottom_right">·</i><div class="container"><div class="content js_cn_display">' + o.opts.lastTimeData + '</div></div></div><div class="header"><div class="cancel js_cancel">取消</div><div class="intro">请选择车牌号</div><div class="delete js_delete"><i></i></div></div><div class="main js_cn_main"></div></section>';
        return t
      }
    };
  return {
    init: o.init
  }
})