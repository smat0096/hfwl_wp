define(function(require, exports, module) { 

  var base = {
    'common' : require("./ks_common")
    ,'utils' : require("./ks_utils.js")
    ,'dom' : require("./ks_dom.js")
    ,'map' : require("./ksmap/ks_map.js")
    ,'validate' : require("./ksvalidate/ks_validate.js")
    ,'valiOpts' : require("component/user/validate_options.js")
    ,'picker' : require("./kspicker/ks_picker.js")
    //,'site' : require("site")
    //,router = require("../router/router.js") 相互引用,报错
    
  }

  return base;
});
