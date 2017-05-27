define(function(require, exports, module) {
  "use strict";
  // require('vuex');
  //Vue.use(Vuex);
  var map = require('./modules/map.js');
  //var user = require('./modules/user.js');
  //var headerChoose = require('./modules/header-choose.js');
  var strict = window._G_.mode.status != window._G_.mode.server;
  return new Vuex.Store({
    //actions : actions,
    //getters: getters,
    modules: {
      map : map
      //,user : user
      //headerChoose : headerChoose
    },
    strict: strict,
  });
})
