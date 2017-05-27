/** 作者 空山, 112093112 **/
define(['KsMap','city-picker','jquery-weui-ks-change'], function(KsMap) {
  var KsMapP = function(opts){
    this.ksmap = KsMap(opts);
  }
  window.KsMapP = window.KsMapP || KsMapP;
  KsMapP.prototype = {
    constructor : KsMapP,
    init :  function(opts){

    },
    shipper : function(opts){
      var myMap = this.ksmap;
      var defaultDriverOpts = {
        start : "#start",
        end : "#end",
        addrmsg : '.addr_msg',
        drag : true,
        oneCity : true,
        showMap : true,
        addrWithMap : false
      };

      var opts = extend({},defaultDriverOpts,opts );
      var $start = $(opts.start);
      var $end = $(opts.end);
      var driveStatus = {
          pois:{},
          drag : opts.drag
        };

      $start.cityPicker({
            title: "选择出发地",
            onClose: function (picker) {
              getAddr(driveStatus,picker,'start');
              console.log(picker);
              showAddrMsg(driveStatus);
            }
      });

      $end.cityPicker({
            title: "选择目的地",
            onClose: function (picker) {
              getAddr(driveStatus,picker,'end');
              showAddrMsg(driveStatus);
            }
      });

      $(document).on('click',opts.addrmsg, function(){
        if(!opts.showMap && opts.oneCity && (driveStatus.pois.end.address.city != driveStatus.pois.start.address.city) ) return;
        $.openPopup($(opts.addrmsg).data('target'),function(){
          showAddrMsg(driveStatus);
        });
      });

      $(document).on('click','.close-popup', function(){
        if(!opts.addrWithMap) return;
        $start.val(driveStatus.pois.start.addr);
        $end.val(driveStatus.pois.end.addr);
      });
      
      function showAddrMsg(driveStatus){
        if(driveStatus.pois.start && driveStatus.pois.end){
          showDriveMap(driveStatus, function(driveStatus){
            $(opts.addrmsg).show();
            $('.distance_msg').text(driveStatus.distance);
          })
        }else{
          $(opts.addrmsg).hide();
        }
      }
      function showDriveMap(driveStatus, callback) {
        driveStatus.transit && driveStatus.transit.enableAutoViewport();
        myMap.drive(driveStatus,
          function(driveStatus, routes){
            //console.log(driveStatus === result, driveStatus);//true 使用全局变量传递数据, 注意污染
            callback && callback(driveStatus);
          }
        )
      };
    },
    
    driver : function(opts){
      var myMap = this.ksmap;
      var defaultDriverOpts = {
        start : "#start2",
        end : "#end2",
        addrmsg : '.addr_msg',
        drag : false
      };

      var opts = extend({},defaultDriverOpts,opts );
      var $start = $(opts.start), 
        $end = $(opts.end), 
        driveStatus = {
          pois:{},
          drag : opts.drag
        };

      //添加全国/省/市
      (function($){
        var cityData = $.rawCitiesData;
        cityData.map(function(province){
          province.sub && province.sub.map(function(city){
            if(city.sub && city.sub.length === 1) return city;
            city.sub && city.sub.unshift({
            "name": "全"+city.name,
            "code": city.code
            })
            return city;
          });
          if(province.sub && province.sub.length === 1) return province;
          province.sub && province.sub.unshift({
            "name": "全"+province.name,
            "code": province.code,
            "sub" : [{
              "name": "全"+province.name,
              "code": province.code
            }]
          });
          return province;
        })

        cityData.unshift({
          "name": "全国",
          "code": "100000",
          "sub" : [{
            "name": "全部地区",
            "code": "100000",
            "sub" : [{
              "name": "全部地区",
              "code": "100000"
            }]
          }]
        });

      })($);

      var startAddr ='湖南省 郴州市 北湖区';
      var endAddr = "全国 全部地区 全部地区";
      $start.val(startAddr);
      $end.val(endAddr);
      
      $start.cityPicker({
            title: "选择出发地",
            defaultDistrict : startAddr,
            onClose: function (picker) {
              getAddr(driveStatus,picker,'start');
              console.log(driveStatus.pois.start);
              //showAddrMsg(driveStatus);
            }
      });
      $end.cityPicker({
            title: "选择目的地",
            defaultDistrict : endAddr,
            onClose: function (picker) {
              getAddr(driveStatus,picker,'end');
              console.log(driveStatus.pois.end);
              //showAddrMsg(driveStatus);
            }
      });
    }


  };

  
  
  function getAddr(driveStatus,picker,type){
    var addr = picker.displayValue,
        code = picker.value;
    driveStatus.pois[type] = {
      addr : addr.join(' '),
      address : {
        province : addr[0],
        city : addr[1],
        district : addr[2]
      },
      addrcode:{
        province : code[0],
        city : code[1],
        district : code[2]
      }
    };
    return driveStatus;
  }

  return KsMapP;
});

