define(function(require, exports, module) { 
  "use strict";

    var routes = [
      {
        path: '/home',
        component:function(resolve){
            require.async(['pages/home/home.js'],resolve);
        }
      }
      ,{
        path: '/aboutPage',
        component:function(resolve){
            require.async(['pages/about/aboutPage.js'],resolve);
        }
      } 
      ,{
        path: '/findGoodsS',
        component:function(resolve){
            require.async(['pages/find/findGoods.js'],resolve);
        }
      } 
      ,{
        path: '/findGoodsContact',
        component:function(resolve){
            require.async(['pages/find/findGoodsContact.js'],resolve);
        }
      } 
      ,{
        path: '/sendGoodsP',
        component:function(resolve){
            require.async(['pages/send/sendGoodsP.js'],resolve);
        }
      } 
      ,{
        path: '/sendGoodsR',
        component:function(resolve){
            require.async(['pages/send/sendGoodsR.js'],resolve);
        }
      } 
      ,{
        path: '/sendGoodsU',
        component:function(resolve){
            require.async(['pages/send/sendGoodsU.js'],resolve);
        }
      } 
      ,{
        path: '/sendGoodsL',
        component:function(resolve){
            require.async(['pages/send/sendGoodsL.js'],resolve);
        }
      } 
      ,{
        path: '/carportKnown',
        component:function(resolve){
            require.async(['pages/carport/carportKnown.js'],resolve);
        }
      } 
      ,{
        path: '/carportAdd',
        component:function(resolve){
            require.async(['pages/carport/carportAdd.js'],resolve);
        }
      } 
      ,{
        path: '/carportContact',
        component:function(resolve){
            require.async(['pages/carport/carportContact.js'],resolve);
        }
      } 
      ,{
        path: '/carportSource',
        component:function(resolve){
            require.async(['pages/carport/carportSource.js'],resolve);
        }
      } 
      ,{
        path: '/userSetting',
        component:function(resolve){
            require.async(['pages/user/userSetting.js'],resolve);
        }
      }
      ,{
        path: '/userAuditeDriver',
        component:function(resolve){
            require.async(['pages/user/user-audite-driver.js'],resolve);
        }
      }
      ,{
        path: '/userAuditeSender',
        component:function(resolve){
            require.async(['pages/user/user-audite-sender.js'],resolve);
        }
      }
      ,{
        path: '/userCommentCar',
        component:function(resolve){
            require.async(['pages/user/user-comment-car.js'],resolve);
        }
      }
      ,{
        path: '/userCommentSelf',
        component:function(resolve){
            require.async(['pages/user/user-comment-self.js'],resolve);
        }
      }

      ,{
        path: '/businessR',
        component:function(resolve){
            require.async(['pages/business/businessR.js'],resolve);
        }
      }
      // ,{
      //   path: '/businessAuditeDriver',
      //   name: 'businessAuditeDriver',
      //   component:function(resolve){
      //       require.async(['pages/business/business-audite-driver.js'],resolve);
      //   }
      // }
      // ,{
      //   path: '/businessAuditeSender',
      //   component:function(resolve){
      //       require.async(['pages/business/business-audite-sender.js'],resolve);
      //   }
      // }
      
      ,{
        path: '/depart',
        component:function(resolve){
            require.async(['pages/about/depart.js'],resolve);
        }
      }
      ,{
        path: '/mileage',
        component:function(resolve){
            require.async(['pages/about/mileage.js'],resolve);
        }
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
    });
    return router;
});
