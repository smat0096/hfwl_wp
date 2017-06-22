define(function (require, exports, module) {
  'use strict'
// require("juery");
/**
 * 1. 字符串
 * 2. 数字
 * 3. 函数
 * 4. 数组
 * 5. 对象
 * 6. Date 时间
 * 7. ajax
 * 8. 表单
 * 9. dom操作
 */
  var _ks, ks_utils
  _ks = ks_utils = {
  /*  1. 字符串 S **/
    trim: function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
  /*  1. 字符串 S **/
  /*  2. 数字 S */
  /*  2. 数字 E */
  /*  3. 函数处理 S */
    /**
     * [run description]
     * @return {[bool| objece]} [执行函数, 警告: 返回值不一致]
     */
    run: function () {
      var context = this,
        args = [].slice.call(arguments),
        fn = args.shift()
      if (fn && typeof fn === 'function') {
        return fn.apply(context, args)
      } else {
        // console.warn('回调函数错误',args);
        return false
      }
    },
    /*
    * 频率控制 和 空闲控制
    * @param fn {function}  需要调用的函数
    * @param delay  {number}    延迟时间，单位毫秒
    * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
    * @return {function}实际调用函数
    * 参数效果:
    * immediate  true :间隔不满足delay时,会延迟执行
    * debounce   true :两次触发的间隔必须大于delay才会执行,
    * true, true  连续触发时,小于delay不会连续执行,只执行停止触发时的最后一次;
    * false, true 连续触发时,小于delay不会连续执行,只执行初始触发第一/二次;
    * true, false 连续触发时,会按照delay间隔连续执行;触发次数会比 false false 多;
    * false, false 连续触发时,会按照delay间隔连续执行;
    */
    throttle: function (fn, delay, immediate, debounce) {
      var curr = +new Date(), // 当前事件
        last_call = 0,
        last_exec = 0,
        timer = null,
        diff, // 时间差
        context, // 上下文
        args,
        exec = function () {
          last_exec = curr
          fn.apply(context, args)
        }
      return function () {
        curr = +new Date()
        context = this,
        args = arguments,
        diff = curr - (debounce ? last_call : last_exec) - delay
        clearTimeout(timer)
        if (debounce) {
          if (immediate) {
            timer = setTimeout(exec, delay)
          } else if (diff >= 0) {
            exec()
          }
        } else {
          if (diff >= 0) {
            exec()
          } else if (immediate) {
            timer = setTimeout(exec, -diff)
          }
        }
        last_call = curr
      }
    },
    debounce: function (fn, delay, immediate) {
      return this.throttle(fn, delay, immediate, true)
    },
    lazy: function (fn, delay) {
      return this.throttle(fn, delay, true, true)
    },
  /*  3. 函数处理 E */
  /*  4. 数组 S  */
    isArray: function (obj) {
      if (typeof obj === 'object' && obj.constructor == Array) {
        return true
      }
      return false
    },
    inArray: function (param, array) {
      for (var i = 0, iL = array.length; i < iL; i++) {
        if (param === array[i]) return true
      }
      return false
    },
    toArray: function (arrayLike) {
      return [].slice.call(arrayLike)
    },
  /*  4. 数组 E  */
  /*  5. 对象 S */
    inObj: function (param, obj) {
      for (var i in obj) {
        if (typeof obj[i] !== 'undefined' && obj.hasOwnProperty(i) && param === obj[i]) return true
      }
      return false
    },
    extend: function () {
      if (!arguments.length) return {}
      var args = [].slice.call(arguments)
      var obj = args.shift()
      for (var i = 0, aLen = args.length; i < aLen; i++) {
        args[i] = args[i] || {}
        for (var j in args[i]) {
          if (args[i].hasOwnProperty(j) && typeof args[i][j] !== 'undefined') {
            obj[j] = args[i][j]
          }
        }
      }
      return obj
    },
    clone: function (obj, deep) {
      if (!obj) return obj
      var copyArr = []
      return (function copy (obj) {
        var cloneObj
        if (typeof obj !== 'object' || !obj) {
          cloneObj = obj
        } else {
          var C = obj.constructor
          switch (C) {
            case Number:
            case String:
            case Boolean:
            case Date:
            case RegExp:
              cloneObj = new C(obj.valueOf())
              break
            default:
              if (deep) { // 防止无限递归
                for (var i = 0; i < copyArr.length; i++) {
                  if (copyArr[i] === obj) {
                    return obj
                  }
                }
                copyArr.push(obj)
              }
              // 只深拷贝原始对象
              if (C && (C === Object || C === Array)) {
                cloneObj = new C()
                for (var k in obj) {
                  if (obj.hasOwnProperty(k) && obj[k] !== undefined) {
                    cloneObj[k] = deep ? copy(obj[k]) : obj[k]
                  }
                }
              } else {
                cloneObj = obj// 其他类型则直接引用;
              }
              break
          }
        }
        return cloneObj
      })(obj)
    },
  /*  5. 对象 E  */
  /** 6. 时间 S **/
    'date': {
        /** 6. 时间 S **/
      '_getTime': function (date) { // 注意 传值 null 会 返回 0
        return !isNaN(date) ? Number(date) : date ? (new Date(date)).getTime() : (new Date()).getTime()
      },
      '_getDate': function (date) { // 注意 传值 null 会 返回 1970的时间
        return !isNaN(date) ? new Date(Number(date)) : date ? (new Date(date)) : (new Date())
      },
      // 获取该时间戳当天的0点的时间戳
      'getMidnight': function (date) {
        var t = new Date(this._getDate(date).toDateString())
        return t.getTime()
      },
      /**
      * 将日期格式化成指定格式的字符串
      * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
      * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
      * @returns 返回格式化后的日期字符串
      */
      'stringify': function (date, fmt) {
        if (!date) return ''
        date = this._getDate(date)
        fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
        var obj = {
          'y': date.getFullYear(), // 年份，注意必须用getFullYear
          'M': date.getMonth() + 1, // 月份，注意是从0-11
          'd': date.getDate(), // 日期
          'q': Math.floor((date.getMonth() + 3) / 3), // 季度
          'w': date.getDay(), // 星期，注意是0-6
          'H': date.getHours(), // 24小时制
          'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
          'm': date.getMinutes(), // 分钟
          's': date.getSeconds(), // 秒
          'S': date.getMilliseconds() // 毫秒
        }
        var week = ['日', '一', '二', '三', '四', '五', '六']
        for (var i in obj) {
          fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
            var val = obj[i] + ''
            if (i == 'w') {
              return (m.length > 2 ? '星期' : '周') + week[val]
            };
            for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
            return m.length == 1 ? val : val.substring(val.length - m.length)
          })
        }
        return fmt
      },
       /**
       * 将字符串解析成日期
       * @param str 输入的日期字符串，如'2014-09-13'
       * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
       * @returns 解析后的Date类型日期
       */
      parse: function (str, fmt) {
        if (!str) return
        fmt = fmt || 'yyyy-MM-dd'
        var obj = {y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0}
        fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
          str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
            obj[$3] = parseInt(_$1)
            return ''
          })
          return ''
        })
        obj.M-- // 月份是从0开始的，所以要减去1
        var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s)
        if (obj.S !== 0) date.setMilliseconds(obj.S) // 如果设置了毫秒
        return date
      },
      /**
       * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
       * 当天的返回时分，当年的返回月日，否则，返回年月日
       * @param {Object} date
       */
      stringifyFriendly: function (date) {
        if (!date) return ''
        date = this._getDate(date)
        var now = new Date()
        if ((now.getTime() - date.getTime()) < 60 * 1000) return '刚刚' // 1分钟以内视作“刚刚”
        var temp = this.stringify(date, 'y年M月d')
        if (temp == this.stringify(now, 'y年M月d')) return this.stringify(date, 'HH:mm')
        if (date.getFullYear() == now.getFullYear()) return this.stringify(date, 'M月d日')
        return temp
      },
      /* 离目前多久 */
      timeDiff: function (time) {
        if (!time) return ''
        time = this._getTime(time)
        var diffTime = (new Date()).getTime() - time
        return this.timeFriendly(diffTime)
      },
      /**
       * 将一段时长转换成友好格式，如：
       * 147->“2分27秒”
       * 1581->“26分21秒”
       * 15818->“4小时24分”
       * @param {Object} time
       */
      timeFriendly: function (time) {
        if (!time) return ''
        time = this._getTime(time)
        var str = '',
          second = time / 1e3
        if (second < 1) {
          str = '刚刚'
        } else if (second < 60) {
          str = second + '秒'
        } else if (second < 60 * 60) {
          str = (second - second % 60) / 60 + '分' + second % 60 + '秒'
        } else if (second < 60 * 60 * 24) {
          str = (second - second % 3600) / 60 / 60 + '小时' + Math.round(second % 3600 / 60) + '分'
        } else if (second < 60 * 60 * 24 * 30) {
          str = (second / 60 / 60 / 24).toFixed() + '天'
        } else if (second < 60 * 60 * 24 * 365) {
          str = (second / 60 / 60 / 24 / 30).toFixed() + '个月'
        } else {
          str = (second / 60 / 60 / 24 / 365).toFixed() + '年'
        };
        return str
      },
      'getLastTime': function (time) {
        time = this._getTime(time)
        var now = (new Date()).getTime(),
          str = '',
          diff = now - time,
          midnight = this.getMidnight(now)
        if (diff < 1) str = '刚刚'
        else if (diff < 6e4) str = parseInt(diff / 1e3) + '秒前'
        else if (diff < 18e5) str = parseInt(diff / 6e4) + '分钟前'
        else if (diff > now - midnight) str = this.stringify(time, 'yyyy-MM-dd')
        else {
          var m = diff % 36e5,
            h = parseInt(diff / 36e5)
          m = parseInt(s / 6e4)
          str = h + '小时' + m + '分前'
        }
        return str
      }
    },
  /** 6. 时间 E **/
  /** 7. ajax url S  **/
  /**
   * [description]
   * @param  {[string]} name [变量名]
   * @param  {[string]} type [取址类型 search | hash ]
   * @return {[string]}      [变量值]
   */
    'getUrlParam': function (name, type) {
      var str
      if (type === 'hash') {
        str = window.location.hash
      } else if (type === 'search') {
        str = window.location.search
      } else {
        str = window.location.search// href
      };
      str = new RegExp('(^|&|\\?)' + name + '=([^&$]*)', 'i').exec(str.substr(1))
      if (str) {
        try {
          str = decodeURIComponent(str[2])
        } catch (error) {
          str = ''
          console.error('非法URI字符串', error)
        }
      } else {
        str = ''
      }
      return str
    },
    'joinUrlParam': function (data) {
      var str = ''
      switch (typeof data) {
        case 'string':
          str = data
          break
        case 'object':
          for (var key in data) {
            if (data.hasOwnProperty(key) && data[key] !== undefined) {
              str += ('&' + key + '=' + encodeURIComponent(data[key]))
            }
          }
          break
        default:
          console.error('数据错误', data)
          break
      };
      str = str.replace(/^\&|\&$/g, '')
      return str
    },
    'ajax': function (opts, callback) {
      var _this = this
      if (opts && opts.type === 'jsonp') {
        _this.jsonp(opts, callback)
        return
      };
      var defaults = {
        'type': 'get',
        'async': true,
        'timeout': 30000,
        'url': '',
        'data': '', // 字符串或json
        'dataType': 'json',
        'success': '',
        'error': '',
        'complete': ''
      }
      opts = _this.extend({}, defaults, opts)
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : XDomaiRequest ? new XDomaiRequest() : new ActiveXObject('Microsoft.XMLHttp') // IE优先使用2.0
      var type = opts.type.toLowerCase(),
        url = opts.url,
        data = opts.data,
        success = opts.success,
        error = opts.error,
        complete = opts.complete
      data = _this.joinUrlParam(data)
      if (type === 'get') {
        url += /\?/.test(url) ? '&' : '?'
        url += data
      };
      /* get 的情况需拼接字符串 E */
      xhr.timeout = opts.timeout // 设置超时
      xhr.open(type, url, opts.async)
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      xhr.send(data)
      xhr.ontimeout = function (event) {
        console.error('请求超时！')
        _this.run(error, xhr)
        _this.run(complete, res)
      }
      xhr.onreadystatechange = function (a) {
        var res
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            res = xhr.responseText
            if (opts.dataType === 'json') {
              // res = eval("("+res+")");
              res = JSON.parse(res.replace(/(\"\s+)|(\s+\")/g, '\"').replace(/(\'\s+)|(\s+\')/g, "\'"))
            }
            _this.run(success, res)
          } else {
            console.warn('ajax错误', xhr)
            _this.run(error, xhr)
          };
          res = res || xhr
          _this.run(complete, res)
          _this.run(callback, res)
        };
      }
    },
    'jsonp': function (opts, callback) {
      var _this = this
      var defaults = {
        'url': '',
        'data': '', // 字符串或json
        'dataType': 'json',
        'jsonp': 'callback', // 后端定义的接收回调函数名的key,默认为callback;
        'jsonpCallback': 'jsonp_' + (new Date()).getTime() + '_' + Math.random().toString().substr(2), // 前端回调执行的函数名,默认为随机数;
        // jsonp不会发送错误回调
        'success': '',
        'complete': ''
      }
      opts = _this.extend({}, defaults, opts)
      var data = opts.data,
        url = opts.url,
        success = opts.success,
        complete = opts.complete,
        jsonpCallback = opts.jsonpCallback,
        callbackUrl = opts.jsonp + '=' + jsonpCallback,
        script = document.createElement('script')
      data = _this.joinUrlParam(data)
      data += data ? '&' + callbackUrl : callbackUrl
      url += /\?/.test(url) ? '&' : '?'
      url += sign + data
      // 加个时间戳，防止缓存
      if (url.indexof('_time=') === -1) {
        url += '&_time=' + (new Data()).getTime()
      };
      script.src = url
      script.type = 'text/javascript'

      // 如果没有自定义回调函数
      window[jsonpCallback] || (window[jsonpCallback] = function (res) {
          // 执行后销毁
        window[jsonpCallback] = undefined
        script.parentNode && script.parentNode.removeChild(script)
        script = null
          // 执行回调
        _this.run(success, res)
        _this.run(complete, res)
        _this.run(callback, res)
      })

      // 添加到dom中;
      document.body.appendChild(script)
    },
    'cookie': {
      read: function (name) {
        var cookieStr = ';' + document.cookie + ';'
        var index = cookieStr.indexOf(';' + name + '=')
        if (index != -1) {
          var s = cookieStr.substring(index + name.length + 3, cookieStr.length)
          return decodeURIComponent(s.substring(0, s.indexOf(';')))
        } else {
          return null
        }
      },
      set: function (name, value, expires) {
        var expDays = expires * 24 * 60 * 60 * 1000
        var expDate = new Date()
        expDate.setTime(expDate.getTime() + expDays)
        var expString = expires ? ';expires=' + expDate.toGMTString() : ''
        var pathString = ';path=/'
        document.cookie = name + '=' + encodeURIComponent(value) + expString + pathString
      },
      del: function (name, value, expires) {
        var exp = new Date(new Date().getTime() - 1)
        var s = this.read(name)
        if (s != null) {
          document.cookie = name + '=' + s + ';expires=' + exp.toGMTString() + ';path=/'
        }
      }
    }
  /** 7. ajax url E  **/

  }

  window.ks_utils = window.ks_utils || ks_utils
  return window.ks_utils
});
/* 10 全局兼容 polyfile S */
// 浏览器环境
(function (window, factory) {
  factory(window)
})(window, function (window) {
  if (!window) return
  //
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

  // 视频流
  window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

  //
})
/* 10 全局兼容 polyfile E */
