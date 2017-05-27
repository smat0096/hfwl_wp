define(function(require, exports, module) { 
  "use strict";
  // require('vue-router');
  //Vue.use(VueRouter);

  var _pages = {
    'home' : require('pages/home/home.js')
    ,'aboutPage' : require('pages/about/aboutPage.js')
    ,'findGoodsS' : require('pages/find/findGoods.js')
    ,'findGoodsContact' : require('pages/find/findGoodsContact.js')
    ,'sendGoodsP' : require('pages/send/sendGoodsP.js')
    ,'sendGoodsL' : require('pages/send/sendGoodsL.js')
    ,'sendGoodsR' : require('pages/send/sendGoodsR.js')
    ,'sendGoodsU' : require('pages/send/sendGoodsU.js')
    ,'carportAdd' : require('pages/carport/carportAdd.js')
    ,'carportKnown' : require('pages/carport/carportKnown.js')
    ,'carportContact' : require('pages/carport/carportContact.js')
    ,'carportSource' : require('pages/carport/carportSource.js')
    ,'userSetting' : require('pages/user/userSetting.js')
    ,'userAuditeDriver' : require('pages/user/user-audite-driver.js')
    ,'userAuditeSender' : require('pages/user/user-audite-sender.js')
    ,'userCommentCar' : require('pages/user/user-comment-car.js')
    ,'userCommentSelf' : require('pages/user/user-comment-self.js')
    ,'businessR' : require('pages/business/businessR.js')

    ,'depart' : require('pages/about/depart.js')
    ,'mileage' : require('pages/about/mileage.js')
  };

    var routes = [
      {
        path: '/home',
        component: _pages.home
      }
      ,{
        path: '/aboutPage',
        component: _pages.aboutPage
      } 
      ,{
        path: '/findGoodsS',
        component: _pages.findGoodsS
      } 
      ,{
        path: '/findGoodsContact',
        component: _pages.findGoodsContact
      } 
      ,{
        path: '/sendGoodsP',
        component: _pages.sendGoodsP
      } 
      ,{
        path: '/sendGoodsR',
        component: _pages.sendGoodsR
      } 
      ,{
        path: '/sendGoodsU',
        component: _pages.sendGoodsU
      } 
      ,{
        path: '/sendGoodsL',
        component: _pages.sendGoodsL
      } 
      ,{
        path: '/carportKnown',
        component: _pages.carportKnown
      } 
      ,{
        path: '/carportAdd',
        component: _pages.carportAdd
      } 
      ,{
        path: '/carportContact',
        component: _pages.carportContact
      } 
      ,{
        path: '/carportSource',
        component: _pages.carportSource
      } 
      ,{
        path: '/userSetting',
        component: _pages.userSetting
      }
      ,{
        path: '/userAuditeDriver',
        component: _pages.userAuditeDriver
      }
      ,{
        path: '/userAuditeSender',
        component: _pages.userAuditeSender
      }
      ,{
        path: '/userCommentCar',
        component: _pages.userCommentCar
      }
      ,{
        path: '/userCommentSelf',
        component: _pages.userCommentSelf
      }
      ,{
        path: '/businessR',
        component: _pages.businessR
      }
      ,{
        path: '/depart',
        component: _pages.depart
      }
      ,{
        path: '/mileage',
        component: _pages.mileage
      }
      ,{
        path: '*',
        redirect: '/home'
      }
    ];

    var router = new VueRouter({
      //mode: 'history',
      base: '/',
      linkActiveClass: 'active',
      routes: routes
      //,scrollBehavior: function (to, from, savedPosition) { return savedPosition || { x: 0, y: 0 } }
    });
    return router;
});
