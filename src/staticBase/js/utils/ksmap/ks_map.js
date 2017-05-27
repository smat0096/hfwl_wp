
/**
 * 1. init 初始化
 * 2. 地图小API
 * 3. 获取数据 异步 需实例化
 * 4. 转换地址数据 需hash数据,无需实例化 E 
 * 5. 绘制覆盖物
 * 6. 事件监听
 * 作者 空山, 112093112 *
 */

define( function(require, exports, module) {
  "use strict";
    //require('../lib/jquery-weui/lib/jquery-2.1.4.js');
    var _ks = require('../ks_utils.js');
    var addressHash = require('../../city/siteHash.js');
    var codeHash= require('../../city/siteHashDo');
    var positionHash= require('../../city/positionHash');
    var defaltInfoOpts = {
      width : 250,     // 信息窗口宽度
      height: 80,     // 信息窗口高度
      title : "信息窗口" , // 信息窗口标题
      enableMessage:true//设置允许信息窗发送短息
    };
    var defaultMarkerEventOpts ={
      showInfo : false, //可为函数
      drag : false, //可为函数
      click : false //可为函数
    };
    var defaults = {
      mapId : 'bmap',
      ak : 'DNbYBM3B9ANr8MlAPOiGVGhTU6b5B2z5',
      zoom : 12,
      options : {
        minZoom:6,
        maxZoom:15,
        enableMapClick: false
      }
    };
    var KsMap = function(opts){
      return new KsMap.fn.init(opts);
    };

  var _k = KsMap.prototype = KsMap.fn = {
  /* 1. init 初始化  S */
    constructor : KsMap,
    ak : defaults.ak,

    init :  function(opts){
      var _this = this;
      opts = _ks.extend({},defaults,opts);
      // 百度地图API功能
      _this.map = new BMap.Map(opts.mapId, opts.options);
      _this.opts = opts;
      _this.ak = opts.ak;
      _this.eventsEffects = [];
      _this.marks = [];
      _this.user = {};
      _this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); 
      //启用滚轮放大缩小，默认禁用
      _this.map.enableScrollWheelZoom();
      //启用地图惯性拖拽，默认禁用
      //_this.map.enableContinuousZoom();
      window.ksmap = _this;
      KsMap.ksmap = _this;
      return _this;
    },
  /* 1. init 初始化  E */
  /* 2. 地图小API  S */
    makePoint : makePoint,
    panTo : function(point){ //动画移动居中
      point = makePoint(point);
      this.map.setZoom(14); 
      this.map.panTo(makePoint(point));
      return this;
    },
    setViewport : function(points){
      this.map.setViewport(points);
      return this;
    },
    clearOverlays : function(){
      this.map.clearOverlays();
      return this;
    },
    removeOverlay : function(mark){
      this.map.removeOverlay(mark);
      return this;
    },
  /* 2. 地图小API  E */
  /* 3. 获取数据 异步 S **/
    //获取用户周边范围
    getUserArea: function(point, callback) {
      var _this = this,
          map = _this.map;
      point = makePoint(point);
      map.centerAndZoom(point, 12);
      map.enableScrollWheelZoom(true);
      var options = {
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_ZOOM,
        enableGeolocation: true,
        offset: new BMap.Size(10, 80)
      };
      map.addControl(new BMap.NavigationControl(options));
      map.enableDragging();
      _this.dragend(callback);
      var area = _this.getArea();
      return area
    },
    dragend: function(callback) {
      var _this = this;
      _this.map.addEventListener("dragend", function(t) {
        if (callback && "function" == typeof callback) {
          var area = _this.getArea();
          _ks.run(callback, area)
        }
      })
    },
    getArea: function() {
      var area = {},
          bounds = this.map.getBounds();
      area.minLat = bounds.Ie; 
      area.maxLat = bounds.De; 
      area.minLng = bounds.Je; 
      area.maxLng = bounds.Ee;
      return  area;
    },
    //获取距离
    getDistance: function(start, end) {
      var distance;
      start = makePoint(start);
      end = makePoint(end);
      distance = parseInt(this.map.getDistance(start, end));
      if(start && end && (distance || distance===0)){
        distance = distance > 1e3 ? parseFloat(distance / 1e3).toFixed(1) + "公里" : distance + "米";
      }else{
        console.error('参数错误,无法获取距离',start,end,distance);
        distance = '未知';
      }
      return  distance;
    },

    /* 无需实例化 S */
    //获取地址 通过坐标 异步
    getLocation : function(point,callback){ 
      var _this = this;
      point = makePoint(point),
      geoc = new BMap.Geocoder();
      geoc.getLocation(point, function(res){
          _ks.run(callback, res);
      });
      return this;
    },
    //获取坐标 通过地址 异步 
    getPosition : function(address,callback,city){
      var geoc = new BMap.Geocoder();
      function _getPoint(point){
        if (point) {
          _ks.run(callback, point);
        }else{
          console.error("地址解析失败!");
          _ks.run(callback);
        }
      }
      city ? geoc.getPoint(address, _getPoint, city) : geoc.getPoint(address, _getPoint);
    },
    //获取用户当前坐标位置
    getCurrentPosition : function(callback){
      var geol = new BMap.Geolocation();
      geol.getCurrentPosition(function(res){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          _ks.run(callback, res);
        } else {
          console.error('获取用户位置失败', this.getStatus());
          _ks.run(callback, res);
        }        
      },{enableHighAccuracy: true})
      return this;
    },
  /* 3. 获取数据 异步 E **/
  /* 4. 转换地址数据 需hash数据,无需实例化 S **/
    //获取用户当前坐标位置 通过 IP API, 可不需实例化, KsMap.fn.getUserPositionByIp()来调用;
    getUserPositionByIp: function(callback) {
      var _this = this;
      var ak = _this.ak || KsMap.fn.ak;
      return $.ajax({
        type: "get",
        url: "https://api.map.baidu.com/location/ip?v=2.0&ak="+ak+"&coor=bd09ll",
        dataType: "jsonp",
        success: function(res) {
          _ks.run(callback, res)
        },
        error : function(res){
          console.error("获取用户位置失败",res);
          _ks.run(callback, res)
        }
      })
    },
    getCityByAddress: function(address) {
      address = address || '';
      var s = address.replace(/[市|省|]+/g, "");
      s = s.replace("自治区", "");
      s = s.replace("回族", "");
      s = s.replace("壮族", "");
      s = s.replace("维吾尔", "");
      s = s.replace("地区", "");
      s = s.replace("海南直辖县级行政单位", "");
      s = s.replace("特别行政区", "");
      s = s.replace("蒙古自治州", "");
      s = s.replace("土家族苗族自治州", "");
      s = s.replace("北京北京", "北京");
      s = s.replace("天津天津", "天津");
      s = s.replace("上海上海", "上海");
      s = s.replace("重庆重庆", "重庆");
      return s || '';
    },
    getCityCodeByCity: function(city) {
      var code = codeHash[city];
      return code || '';
    },
    getCityCodeByAddress: function(address) {
      address = address || '';
      var  s = this.getCityByAddress(address);
      s = s.slice(0,4);
      var code = codeHash[s];
      return code || '';
    },
    getCityAddressByCode: function(code) {
      return addressHash[code] || '';
    },    
    getPositionByCode: function(code) {
      return positionHash[code] || '';
    },
    getUserCityHash: function(callback) {
      var _this = KsMap.fn;
      _this.getUserPositionByIp(function(res) {
        var content = res.content;
          content.point = makePoint(content.point);
        var  address = content.address,
          province = content.address_detail.province.replace("省", ""),
          city = content.address_detail.city,
          cityCode = _this.getCityCodeByAddress(address) || _this.getCityCodeByAddress(province+''+city)|| _this.getCityCodeByAddress(province),
          cityName = _this.getCityAddressByCode(cityCode),
          cityPoint = makePoint(_this.getPositionByCode(cityCode)),
          user = {
            cityCode : cityCode,
            cityName : cityName,
            cityPoint : cityPoint,
            point : content.point,
            content : content
          }; // ks_change_wait debug
        _ks.run(callback, user);
      })
    },
  /* 4. 转换地址数据 需hash数据,无需实例化 E **/
  /* 5. 绘制覆盖物 S **/
    //标记并移动中心点
    markCenter: function(point) {
      point = makePoint(point);
      this.map.centerAndZoom(point, 14); 
      this.map.clearOverlays();
      this.addMark(point);
    },
    //mark
    addMark: function(point, opts, markEvent) {
      var _this = this,
        map = _this.map,
        eventsEffects = _this.eventsEffects;
      var defaults = {
        //显示自定义图标
        iconUrl : null,
        iconWidth : 23,
        iconHeight : 25,
        iconOffset : {x:0,y:0},
        iconImageOffset : {x:0,y:0},
        //显示固定文字label
        labelTitle : '',
        labelOffset : {x:0,y:0}
      }
      opts = _ks.extend({}, defaults, opts);
      var icon,label;
      var point = makePoint(point);
      var mark = new BMap.Marker(point);

      if (eventsEffects && eventsEffects.length){
        for (var i = 0, n = eventsEffects.length; i< n; i++) {
          //eventsEffects[i].hide();
        }
      };
      if(opts.iconUrl){
        icon = new BMap.Icon(
          opts.iconUrl, 
          new BMap.Size(opts.iconWidth, opts.iconHeight),
          {
            offset : new BMap.Size(opts.iconOffset.x, opts.iconOffset.y),
            imageOffset : new BMap.Size(opts.iconImageOffset.x, opts.iconImageOffset.y),
            infoWindowAnchor: new BMap.Size(21.5, 0)
          }
        );
        mark.setIcon(icon);
      };
      if(opts.labelTitle){
        label = new BMap.Label(
          opts.labelTitle, 
          {
            offset : new BMap.Size(
              opts.labelOffset.x, 
              opts.labelOffset.y
            )
          }
        )
        mark.setLabel(label);
      };
      
      map.addOverlay(mark);
      if(markEvent){
        _this.boundMarkEvent(mark, markEvent)
      }
      return mark;
    },
    //驾车路线
    drawRouteByCityHash :function(opts, callback){
      var _this = this;
      var sum = 2, num = 0;
      if(opts.start.point && opts.end.point){
        return _this.searchDrivingRoute(opts,callback);
      }else if(opts.start.cityCode && opts.end.cityCode){
        opts.start.point = makePoint(_this.getPositionByCode(opts.start.cityCode));
        opts.end.point = makePoint(_this.getPositionByCode(opts.end.cityCode));
        return _this.searchDrivingRoute(opts,callback);
      }else if(opts.start.cityName && opts.end.cityName){ //异步, 无法正确获取返回值;
        _this.getPosition(opts.start.cityName,function(point){
          opts.start.point = makePoint(point);
          num ++;
          if(num >= sum) return _this.searchDrivingRoute(opts,callback);
        });
        _this.getPosition(opts.end.cityName,function(point){
          opts.end.point = makePoint(point);
          num ++;
          if(num >= sum) return _this.searchDrivingRoute(opts,callback);
        });
      };
    },
    searchDrivingRoute : function(opts,callback){
      var _this = this;
      var defaults = {
        start : '',
        end : '',
        autoView : true,
        dragable : false,
        path : 0
      }
      var paths = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
      opts = _ks.extend({}, defaults, opts);
      //var driveDraged = false; //判断是否由外部调用还是内部拖拽
      
      //回调执行
      function polylinesSet (routes){
        //driveDraged && transit.disableAutoViewport();
        //driveDraged = true;
        opts.routes = routes;
        _ks.run(callback ,opts);//回调函数
      };

      function searchComplete (results){
        if (transit.getStatus() != BMAP_STATUS_SUCCESS){
          console.log("对不起, 获取路线失败");
          opts.results = results;
          return;
        };
        opts.results = results;
        opts.plan = results.getPlan(0);
        opts.start = results.getStart();
        opts.end = results.getEnd();
        opts.duration = opts.plan.getDuration(true);//获取时间
        opts.distance = opts.plan.getDistance(true);//获取距离
      };
      var transit = new BMap.DrivingRoute(_this.map, {
        renderOptions: {
          map: _this.map,
          enableDragging : opts.dragable, //起终点可进行拖拽
          autoViewport: opts.autoViewport
        },
        //policy : paths[0], //路径选择
        onSearchComplete: searchComplete,
        onPolylinesSet: polylinesSet
      });
      opts.transit = transit;
      transit.clearResults();
      if(opts.start.point &&  opts.end.point){
        transit.search(opts.start.point , opts.end.point);
        return true;
      }else{
        return false;
      }
      
    },
    //直接获取驾车距离, 因跨越问题只能jsonP调用, 可使用后端代理,大概率出现模糊地址
    getDrivingDistance : function(opts){
      var _this = this;
      var start,end;
          opts.try = opts.try || 1,
          param = ['start','end'];
      var ak = _this.ak || KsMap.fn.ak;

      for(var i=0, iLen = param[i].length; i< param; i++){
        var p = opts[param[i]];
        if(!p.point){
          opts.try++;
          if(opts.try > 3) {
            console.error("过多尝试");
            return;
          }
          _this.getPosition(p.address,function(point){
            p.point = point;
            _this.getDrivingDistance(opts);
          },p.city)
        }
      }
      start = opts.start.point.lat.toFixed(6)+','+opts.start.point.lng.toFixed(6);
      end = opts.end.point.lat.toFixed(6)+','+opts.end.point.lng.toFixed(6);
      return $.ajax({
        url: "http://api.map.baidu.com/direction/v1",
        type: "GET",
        data: {
          ak: ak,
          mode : "driving",
          origin : startAddr,
          destination : endAddr,
          origin_region : opts.start.address.city,
          destination_region : opts.end.address.city,
          output : "json"
        },
        dataType:'jsonp',
        //jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        //jsonpCallback:"success",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        success : function(data){
          if(data.type != 1 && data.result && data.result.routes){
            opts.routes = data.result.routes;
            opts.duration = opts.routes[0].duration;
            opts.distance = opts.routes[0].distance;
            if(opts.distance > 10000){
              opts.distance = (opts.distance/1000).toFixed(2) + '公里';
            }else{
              opts.distance += '米';
            }
            success && success.call(_this,data)
          }
          else if (data.type == 1 && !tryAgain){
            console.error("路径检索失败, 多个地址");
          }
        },
        error : function(data,errorType){
          console.error("error : ", data.toSource());
          fail && fail.call(_this,data)
        },
        complete : function(data){
          
        }
      });
    },

    //附近搜索
    localSearch : function(opts){
      var _this = this;
      var defaults = {
        query : '', //查询目标
        center : _this.map.getCenter(), //查询中心点
        radius : 5000, //半径
        type : 'local', //lbs 云检索,local 圆形,bound 矩形,查询方式
        geotableId : '', //lbs 云参数
        renderOptions : { // 渲染参数, null不渲染
          map: _this.map,  //地图
          autoViewport : true //自动缩放
        },
        success : '', //成功回调
        error : '', //失败回调
        complete : '' //始终回调
      }
      opts = _ks.extend({}, defaults, opts);
      // var ltPoi = makePoi({point:_this.map.getBounds().Ll}); //左上
      // var rbPoi = makePoi({point:_this.map.getBounds().ul}); //右下
      var options = {
        renderOptions: opts.renderOptions,
        onSearchComplete : function(results){
          if (local.getStatus() == BMAP_STATUS_SUCCESS){
            _ks.run(opts.success, results);
          }else{
            console.warn('搜索失败',local.getStatus(),results);
            _ks.run(opts.error, results);
          }
          _ks.run(opts.complete, results);
        }
      };
      if(!opts.renderOptions){ options.renderOptions = undefined; }
      _this.map.centerAndZoom(opts.center, 11);
      var local = new BMap.LocalSearch(_this.map, options);

      switch (opts.type) {
        case 'lbs':
          local.searchNearby(opts.query, opts.center, opts.radius, {
            customData: {
              geotableId: opts.geotableId
            }
          });
          break;
        case 'local':
          local.searchNearby(opts.query, opts.center, opts.radius);
          break;
        case 'bound':
          local.searchInBounds(opts.query, _this.map.getBounds());
          break;
        default:
          local.search(opts.query);
          break;
      };
    },
  /* 5. 绘制覆盖物 E **/
  /* 6. 事件监听 S **/
    boundMarkEvent: function(mark, markEvent) {
      var _this = this,
        map = _this.map,
        eventType = markEvent.type,
        callback = markEvent.callback;
      if(eventType.match('drag')){
        mark.enableDragging();
      };
      mark.addEventListener(eventType, function(e) {
        var point = e.point;
        map.markCenter(point);
        _ks.run(callback, point)
      });
    }
  /* 6. 事件监听 E **/
  
  }

  KsMap.fn.init.prototype = KsMap.fn;
  window.KsMap = window.KsMap || KsMap;
  return window.KsMap;

  function makePoint (point){
    if(point && (point.lng || point.x ) && (point.lat || point.y)){
      return new BMap.Point(point.lng || point.x, point.lat || point.y);
    }else if(point instanceof Array){
      return new BMap.Point(point[0], point[1]);
    }else{
      console.error('数据错误');
    }
  };

})
