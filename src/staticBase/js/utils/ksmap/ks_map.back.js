/** 作者 空山, 112093112 **/
/** 特点 : 以json类型的pois和poi进行数据操作和全局传值, 数据操作都是针对pois和poi内部的属性进行操作;
*   优点 : 使用 校验 方便
*   缺点 : 容易造成数据间相互污染, 不严谨, 不适合多人合作使用
*

数据格式 :    
pois = { //poi的集合
  center : poi,
  start : poi,
  other : [poi, poi...]
};

poi = { 
    //坐标点的属性扁平化,也用于参数传入
    lat : 纬度,
    lng : 经度,
    addr : 简述地址/详细地址的拼接,
    city : ..
    province : ..
    ...

    //map的原生类型:
    address : { 
      详细地址
      city : ..
      province : ..
      ...
    },
    point : H ,
    marker : ...
    ...
  }
**/

define(['BMapOneClick','base-util','jquery'], function() {
  function getIniting(_poi, callback, initing){
    var defaultIniting = {
      pois : _poi,
      callback : callback,
      sum : 0,
      num : 0,
      pos : 0,
      loc : 0,
      fail : 0,
      inited : false
    };
    initing = initing || defaultIniting;
    return initing;
  }
  function doCallback(callback , _poi, initing){
    //始终传入this,是为了也可以调用内部方法为callback;
    if (typeof callback !== 'function' ) return; 
    initing = getIniting(_poi, callback, initing);
    initing.num++;
    if(initing.inited) {
      console.warn('该回调函数已执行过了!!!!!!!!!!!!!!!!!', initing);
      //return;
    };
    if(typeof initing !=='object' || isNaN(initing.sum) || isNaN(initing.num)|| initing.num >= initing.sum){
      initing.inited = true;

      console.log('-------------------回调函数开始执行----------------------------------');
      //console.error(initing);
      //回调函数第一个参数为单个poi, 
      //如果需要setPois和initPois所传入的pois数据,储存在initing.pois中;
      //注意, 避免在函数的callback中调用自身, 有可能产生递归死循环;
      callback(_poi,initing);
      console.log('-------------------回调函数执行完毕----------------------------------');

      return true;
    }
    return false;
  };
  
  function makePoi (_poi){
    if(typeof _poi === 'object'){
      if (_poi.point && _poi.point.lng && _poi.point.lat ){
        _poi.lng = _poi.point.lng;
        _poi.lat = _poi.point.lat;
        return true;
      }
      if(_poi.lng &&  _poi.lat){
        _poi.point = new BMap.Point(_poi.lng, _poi.lat);
        return true;
      }
    }
    return false;
  };

  var defaultOpts = {
    mapId : 'bmap',
    ak : 'DNbYBM3B9ANr8MlAPOiGVGhTU6b5B2z5',
    pois : {
      center : {
        addr: '郴州',
        address : {
          city : '郴州'
        }
      }//{lng: 113.02253, lat: 25.870389}
    },
    zoom : 12
  };
  
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

  var defaultMakerIcon = {
    url : '',
    w : 23,
    h : 25,
    offset : {x:0,y:0},
    imageOffset : {x:-46,y:-21}
  };

  var defaultMakerLabel = {
    title : '',
    offset : {x:0,y:0}
  }

  var defaultMarkerOpts = {
    event : defaultMarkerEventOpts,
    icon : defaultMakerIcon,
    label: defaultMakerLabel
  }
  
  var defaultDriveOpts = {
    drag : false,
    pois : {
      start : {city: '郴州'},
      end : {city:'北京'}
    }
  };
  var KsMap = function(opts){
      return new KsMap.prototype.init(opts);
    };

  KsMap.prototype = {
    constructor : KsMap,
    init :  function(opts){
      this.opts = extend({},defaultOpts,opts);
      var _this = this;

      // 百度地图API功能
      this.map = new BMap.Map(this.opts.mapId,{minZoom:4,maxZoom:15});
      this.geoc = new BMap.Geocoder();
      this.geol = new BMap.Geolocation();
      this.setPois(this.opts.pois);
      this.initPois();
      this.centerAndZoom();

      this.map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
      this.map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
      return this;
    },
    setPois : function (pois,callback,type){
      this.pois = this.pois || {};
      pois = pois || {};
      if(type === 'clear'){
        this.pois = pois;
      }else if ( type === 'add'){
        this.pois = extendArrayAdd(this.pois,pois);
      }else{
        this.pois = extend(this.pois,pois);
      }
      this.initPois(pois,callback);
      return this;
    },
    eachPois : function(pois,fn,callback){
      var pois = pois || this.pois;
      var initing = getIniting(pois, callback);
      fn = (typeof fn === 'function')? fn : this[fn];
      for(var key in pois){
        if(pois.hasOwnProperty(key) && (typeof pois[key] === "object")) {
          if(isArray(pois[key])){
            for(var i=0; i<pois[key].length; i++){
              initing.sum++
            }
          }else {
            initing.sum++
          }
        }
      }
      for(var key in pois){
        if(pois.hasOwnProperty(key) && (typeof pois[key] === "object")) {
          if(isArray(pois[key])){
            for(var i=0; i<pois[key].length; i++){
              fn.call(this,pois[key][i],callback,initing,key,i);
            }
          }else {
            fn.call(this,pois[key],callback,initing,key);
          }
        }
      }
    },
    initPois : function(pois,callback){
      this.eachPois(pois,'initPoi',callback);
      return this;
    },
      //显示点
    drawMarkers :function(pois,opts,callback){
      var _this = this;
      this.eachPois(pois,function(poi,callback,initing){
        _this.drawMarker.call(_this,poi,opts,initing)
      },callback);
      return this;
    },
    
    initPoi : function (poi,callback,initing){
      var _poi = poi;
      initing = getIniting(_poi, callback, initing);
      if(typeof poi !== 'object'){
        console.error("该Poi数据类型错误",poi);
        initing.fail++;
        doCallback(callback, poi, initing);
        return this;
      };
      makePoi(poi);
      if(typeof callback !== 'function'){ //不存在回调函数则进行不进行深初始化;
        return this;
      }
      if(poi.point){ //获取地址
        //poi.address ? doCallback(callback , poi, initing) : 
        this.getLocation(poi,callback,initing);
      }else if(poi.address){
        this.getPosition(poi,callback,initing); //获取坐标
      }else{
        //注意, 此处参数错误 ,回调函数可能产生递归死循环
        console.error('该Poi数据错误 ',poi);
        initing.fail++;
        doCallback(callback , poi, initing);
      }
      return this;
    },
    //通过地址获取坐标 异步
    getPosition : function(poi,callback,initing){
      var _this = this;
      var _poi = poi;
      var addr = '',
          addrArr = ['province','city','district','street','streetNumber'],
          city;
      initing = getIniting(_poi, callback, initing);
      if (typeof poi === 'object') {
        if(poi.address || poi.addr){
          for(var i=0; i< addrArr.length; i++){
            addr += poi.address[addrArr[i]] ? poi.address[addrArr[i]] : '';
          }
          city = poi.address.city;
          addr = poi.addr;
        }else {
          console.error("getPosition的poi参数缺少地址属性",poi);
          initing.fail++;
          doCallback(callback , _poi, initing);
          return;
        }
      }else{
        console.error("getPosition的poi类型错误",poi);
        initing.fail++;
        doCallback(callback , _poi, initing);
        return;
      };
      function getAddr(point){
        if (point) {
          initing.pos ++;
          _poi.point = point;
          makePoi(_poi);
        }else{
          initing.fail++;
          console.error("您选择地址没有解析到结果!");
        }
        doCallback(callback , _poi, initing);
      }
      city ? this.geoc.getPoint(addr, getAddr, city) : this.geoc.getPoint(addr, getAddr);
      return this;
    },
    //通过坐标获取地址 异步
    getLocation : function(poi,callback,initing){ 
      var _this = this;
      var _poi = poi;
      initing = getIniting(_poi, callback, initing);
      this.geoc.getLocation(poi.point, function(rs){
          // var addrArr = ['province','city','district','street','streetNumber'];
          // for(var i=0; i< addrArr.length; i++){
          //   poi[addrArr[i]] = rs.addressComponents[addrArr[i]];
          // }
          poi.addr = rs.address;
          poi.address = rs.addressComponents;
          initing.loc++;
          doCallback(callback , _poi, initing);
      });
      return this;
    },
    //移动坐标
    panTo : function(poi){
      if(poi.point){
        this.map.panTo(poi.point);
      }
      return this;
    },
    //显示用户当前坐标位置
    getCurrentPosition : function(callback){
      var _this = this;
      this.geol.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          var _poi = {
            point : r.point,
            address : r.address,
            lng: r.point.lng,
            lat: r.point.lat
          }
          _this.setPois({current: _poi},function(poi){
            doCallback(callback ,_poi);
          });
        }
        else {
          console.error('获取用户位置失败'+this.getStatus());
        }        
      },{enableHighAccuracy: true})
      return this;
    },

    //显示点
    drawMarker : function(poi,opts){ 
      var _this = this;
      var _poi = poi;
      opts = opts || {};
      if(makePoi(poi)){ //drawMarker自动尝试浅初始化
        
        //强制清除,还是进行位移
        this.removeOverlay(poi);
        poi.marker = new BMap.Marker(poi.point);
        //poi.marker ?  poi.marker.setPosition(poi.point) : poi.marker = new BMap.Marker(poi.point);

        if(opts.mIcon){
          var _opts1 = extend({},defaultMakerIcon,opts.mIcon);
          var icon = new BMap.Icon(_opts1.url, new BMap.Size(_opts1.w,_opts1.h),{    
             offset: new BMap.Size(_opts1.offset.x, _opts1.offset.y),    // 指定marker定位位置。  
             imageOffset: new BMap.Size(_opts1.imageOffset.x, _opts1.imageOffset.y)   // 设置图片偏移    
           });
          poi.marker.setIcon(icon);
        };

        if(opts.mLabel){
          var _opts2 = extend({},defaultMakerLabel,opts.mLabel);
          var label = new BMap.Label(_opts2.title,{offset: new BMap.Size(_opts2.offset.x,_opts2.offset.y)});
          poi.marker.setLabel(label);
        }

        if(opts.mEvent){
          var _opts3 = extend({}, defaultMarkerEventOpts,opts.mEvent); 
          for(var evt in _opts3){
            //如果该 evt 对应的值为函数 , 则作为回调函数执行;
            if(_opts3[evt] && _opts3.hasOwnProperty(evt) && (typeof this[evt] === 'function')){
              (function(evt){
                _this.on(evt,function(poi){
                  doCallback(_opts3[evt] , _poi);
                },_poi)
              })(evt);
              
            }
          }
        }

        this.map.addOverlay(poi.marker);
      }
      return this;
    },
    
    removeOverlay : function(poi){
      if(poi.marker){
        this.map.removeOverlay(poi.marker);
      }
      return this;
    },
    clearOverlays : function(){
      this.map.clearOverlays();
      return this;
    },

    //中心
    centerAndZoom : function(opts){
      this.pois.center = this.pois.center || {address:{}};
      if(typeof opts === 'string' && opts !== ''){
        this.pois.center.address.city = opts;
      }else if(typeof opts === 'object'){
        this.setPois(opts.pois);
        this.opts.zoom = opts.zoom || this.opts.zoom;
      }
      if(this.pois.center.point){
        this.map.centerAndZoom(this.pois.center.point,this.opts.zoom);
      }else if(this.pois.center.address.city){
        this.map.centerAndZoom(this.pois.center.address.city);
      }
      return this;
    },

    autoViewport : function(pois){
      pois = pois || this.pois;
      var poiArr = [];
      var _this = this;
      var callback = function(){
        if(poiArr.length) this.map.setViewport(poiArr);
      }
      this.eachPois(pois,function(poi,callback,initing){
        if(poi.point){
          poiArr.push(poi.point);
        }
        doCallback(callback ,pois, initing);
      },callback)
      return this;
    },

    drive : function(driveStatus,callback){
      //opts = extend({}, defaultDriveOpts, opts);
      var _this = this , tryed = false;
      var autoViewport = (driveStatus.autoView === undefined || driveStatus.autoView)? true : false;
      var drivePois = driveStatus.pois;
      var dragable = driveStatus.drag;
      var driveDraged = false; //判断是否由外部调用还是内部拖拽

      function searchComplete (results){
        if (transit.getStatus() != BMAP_STATUS_SUCCESS){
          alert("对不起, 获取路线失败");
          if(tryed) return;
          tryed = true;
          try{
            transitSearch();
          }catch(e){
            console.error(e);
          }
          return;
        };

        tryed = false;
        var plan = results.getPlan(0);
        var start = results.getStart();
        var end = results.getEnd();
        var center = _this.map.getCenter();

        drivePois.start = {
          title : start.title,
          lat : start.point.lat,
          lng : start.point.lng,
          marker : start.marker,
          point : start.point
        };
        drivePois.end = {
          title : end.title,
          lat : end.point.lat,
          lng : end.point.lng,
          marker : end.marker,
          point : end.point
        };
        drivePois.center = {
          lat : center.lat,
          lng : center.lng,
          point : center
        };

        _this.opts.zoom = _this.map.getZoom();
        _this.pois.center = {};
        driveStatus.plan = plan;
        driveStatus.duration = plan.getDuration(true);                //获取时间
        driveStatus.distance = plan.getDistance(true);             //获取距离

        //_this.map.setViewport([driveStatus.pois.start.point, driveStatus.pois.end.point])
        //_this.pois.start = results.Qv; 拖动的原点
        //_this.pois.end = results.bv;  拖动的落点
        //doCallback(callback , drivePois);
      }

      var transit = driveStatus.transit || new BMap.DrivingRoute(this.map, {
        renderOptions: {
          map: this.map,
          enableDragging : dragable, //起终点可进行拖拽
          autoViewport: autoViewport
        },
        onSearchComplete: searchComplete,
        onPolylinesSet: function(routes){
          driveDraged && transit.disableAutoViewport();
          driveDraged = true;
          _this.initPois(drivePois,function(){
            driveStatus.routes = routes;
            doCallback(callback ,driveStatus);//回调函数
          })
        }
      });

      driveStatus.transit = transit;

      this.setPois(drivePois, transitSearch);
      function transitSearch(){
        var start = _this.pois.start.point || _this.pois.start.addr || _this.pois.start.address.city,
        end = _this.pois.end.point || _this.pois.end.addr || _this.pois.end.address.city;
        if( start && end ){
          transit.search(start , end);
          return true;
        }
        return false;
      }
      return this;
    },

    //因跨越问题只能jsonP调用, 可使用后端代理,大概率出现模糊地址
    getDriveDistance : function(driveStatus,success,fail){
      var _this = this;
      var tryAgain = false;
      var start = driveStatus.pois.start,
          end = driveStatus.pois.end,
          startAddr, endAddr;
          startAddr = start.point? start.point.lat.toFixed(6)+','+start.point.lng.toFixed(6) : start.addr;
          endAddr = end.point? end.point.lat.toFixed(6)+','+end.point.lng.toFixed(6) : end.addr;
      $.ajax({
        url: "http://api.map.baidu.com/direction/v1",
        type: "GET",
        data: {
          ak: this.opts.ak,
          mode : "driving",
          origin : startAddr,
          destination : endAddr,
          origin_region : driveStatus.pois.start.address.city,
          destination_region : driveStatus.pois.end.address.city,
          output : "json"
        },
        dataType:'jsonp',
        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        jsonpCallback:"success",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
      })
      .done(function(data) {
        if(data.type != 1 && data.result && data.result.routes){
          driveStatus.routes = data.result.routes;
          driveStatus.duration = driveStatus.routes[0].duration;
          driveStatus.distance = driveStatus.routes[0].distance;
          if(driveStatus.distance > 10000){
            driveStatus.distance = (driveStatus.distance/1000).toFixed(2) + '公里';
          }else{
            driveStatus.distance += '米';
          }
          success && success.call(_this,data)
        }else if (data.type == 1 && !tryAgain){
          var origin = data.result.origin.content;
          var destination = data.result.destination.content;
          if( origin && origin.length && destination && destination.length){
            start.lng = origin[0].location.lng;
            start.lat = origin[0].location.lat;
            end.lng = destination[0].location.lng;
            end.lat = destination[0].location.lat;
            tryAgain = true;
            _this.initPois(driveStatus.pois);
            _this.getDriveDistance(driveStatus,success,fail);
          }
        }
        
      })
      .fail(function(data) {
        console.error("error : ", data.toSource());
        fail && fail.call(_this,data)
      })
      .always(function() {
        //console.log("complete");
      });
    },

    //事件
    on: function(evt, callback, target){
      var eventArr = ['click','drag','showInfo']; 
      if(!inArray(evt, eventArr) || typeof this[evt] !== 'function')  return this;
      this[evt](callback, target);
      return this;
    },
    click :function(callback,target){
      var _this = this;
      var oClick = isSupportTouch() ? ((target && target.marker) ? 'click' : 'onetouch') : 'click';
      var marker = target && target.marker || this.map;
      marker.on(oClick, function(e){
      e && e.domEvent && e.domEvent.stopPropagation();
      target ? target.point = e.point : target = {point: e.point};
      _this.initPoi(target);
      doCallback(callback , target);
      });
      return this;
    },
    drag :function(callback,target){
      var _this = this;
      var newPoi, oldPoi;
      var marker = target && target.marker || this.map; 
      marker.enableDragging(); 
      marker.on('dragstart',function(e){
        e && e.domEvent && e.domEvent.stopPropagation();
        oldPoi = {point: e.point};
        _this.initPoi(oldPoi);
      });
      // marker.on('dragging',function(e){
      // e && e.domEvent && e.domEvent.stopPropagation();
      //   console.error("dragging")
      // });
      marker.on('dragend',function(e){
        e && e.domEvent && e.domEvent.stopPropagation();
        target ? target.point = e.point : target = {point: e.point};
        _this.initPoi(target);
        //注意,因为是值引用, oldPoi和 target可能会造成数值更改串联
        doCallback(callback , {new : target, old: oldPoi});
      });
      return this;
    },
    showInfo: function(callback,poi){
      var _this = this;
      var _poi = poi;
      if(!poi.info) return false;
      poi.info.opts = extend( {}, defaltInfoOpts,poi.info.opts);
      poi.info.content = poi.info.content || '';
      this.click(function(_poi_){
        poi.infoWindow = new BMap.InfoWindow(poi.info.content, poi.info.opts);
        this.map.openInfoWindow(poi.infoWindow,poi.point);
      },poi)
      return this;
    },

    //搜索
    search : function(opts){
      
      var _this = this;
      var defaultOpts = {
        query : '',
        center : this.map.getCenter(),
        radius : 5000,
        autoViewport : true,
        type : 'local', //lbs ,local,bound
        geotableId : ''
      }
      opts = extend({}, defaultOpts, opts);
      // var ltPoi = makePoi({point:this.map.getBounds().Ll}); //左上
      // var rbPoi = makePoi({point:this.map.getBounds().ul}); //右下

      var local = this.localSearch || new BMap.LocalSearch(this.map, {
        renderOptions:{map: this.map , autoViewport : opts.autoViewport},
        onSearchComplete : function(results){
          if (local.getStatus() == BMAP_STATUS_SUCCESS){
            console.log('搜索成功',local.getStatus(),results);
            doCallback(opts.success, results);
          }else{
            console.error('搜索失败',local.getStatus(),results);
            doCallback(opts.fail, results);
          }
        }
      });

      this.localSearch = local;
      console.log(1,this.map.getBounds());
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
          local.searchInBounds(opts.query, this.map.getBounds());
          break;
        default:
          local.search(opts.query);
          break;
      };
      
      // 百度地图API功能

      
    }
  }

  KsMap.prototype.init.prototype = KsMap.prototype;
  //window.KsMap = window.KsMap || KsMap;
  return KsMap;
})
