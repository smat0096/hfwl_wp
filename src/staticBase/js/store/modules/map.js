define(function(require, exports, module) {
  var carUrl = window._G_.url.basicUrl + '/staticBase/img/car.png';
  // initial state
  var state = {
    isShow : false,
    type : 'route', // point, route,
    opts : null,
    title : '地图详情',
    message : '',
    carIcon : {
      iconUrl : carUrl,
      iconWidth : 60,
      iconHeight : 60,
      iconOffset : {x:0,y:0},
      iconImageOffset : {x:0,y:0},
    }
  }
  //var mapState = Vuex.mapState;
  // getters
  var getters = {

  }

  // actions
  var actions = {
    'map_show_type' : function(store){
      var typeFn = 'map_show_'+store.state.type;
      store.dispatch(typeFn);
    },
    'map_show_route' : function(store){
      var opts = store.state.opts;
      if(opts){
        ksmap.drawRouteByCityHash(opts,function(res){
          var distance = res.distance || '获取失败';
          var message = '此路线的里程大约: ' + distance;
          store.commit('setMessage', message);
        });
      }
      if(!opts){
        $.alert("", "无法获取位置信息", function() {
          store.commit('map_hide');
        });
      }
    },
    'map_show_point' : function(store){
      var point = KsMap.fn.makePoint(store.state.opts);
      if(point){
          ksmap.markCenter(point); //直接初始化居中
      }else{
        $.alert("", "无法获取位置信息", function() {
          store.commit('map_hide');
        });
      }
    },
    'map_show_car' : function(store){
      var point = KsMap.fn.makePoint(store.state.opts);
      if(point){
        ksmap.addMark(point, store.state.carIcon);
        ksmap.panTo(point);  //动画移动居中
      }else{
        $.alert("", "无法获取位置信息", function() {
          store.commit('map_hide');
        });
      }
    }
  }

  // mutations
  var mutations = {
    showMap : function(state,opts){
      state.opts = opts;
      state.isShow = true;
    },
    setMapType : function(state,type){
      state.type = type;
    },
    'map_hide' : function(state){
      state.isShow = false;
      ksmap.map.clearOverlays();
    },
    setMessage : function(state,message){
      state.message = message;
    }
  }

  return  {
    state : state,
    getters : getters,
    actions : actions,
    mutations : mutations
  }
})
