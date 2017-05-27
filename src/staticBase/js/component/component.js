define(function(require, exports, module) {

  var component =  {
    
    //common
    'header-back' : require('component/common/header-back.js'),
    'header-choose' : require('component/common/header-choose.js'),
    'loadmore-link' : require('component/common/loadmore-link.js'),
    'loadmore-scroll' : require('component/common/loadmore-scroll.js'),
    //'road_hourse' : require('component/common/road_hourse.js'),
    //'lazy-load' : require('component/common/lazy-load.js'),
    'picker-footer' : require('component/common/picker-footer.js'),
    'pull-to-refresh' : require('component/common/pull-to-refresh.js'),
    'loading-page' : require('component/common/loading-page.js'),
    'search-bar' : require('component/common/search-bar.js'),

    //index
    'footer-nav' : require('component/index/footer-nav.js'),
    'map-baidu' : require("component/index/map.js"),
    
    //find
    'find-detail' : require('component/find/find-detail.js'),
    'findgoods-list' : require('component/find/findgoods-list.js'),

    //send
    'sendgoods-list' : require('component/send/sendgoods-listR.js'),
    'footer-batch' : require('component/send/footer-batch.js'),

    //carport
    'car-detail' : require('component/carport/car-detail.js'),
    'car-list' : require('component/carport/car-list.js'),
    
    //user
    'user-detail-head' : require('component/user/user-detail-head.js'),

    //business
    'business-list' : require('component/business/business-list.js'),

    //about
    'depart-list' : require('component/about/depart-list.js'),
    'depart-detail' : require('component/about/depart-detail.js')

  }

  return component;
});
