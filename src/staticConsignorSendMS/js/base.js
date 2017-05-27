define("base", [], function() {
  var s = window.DOMAIN_SEND + "/js",
    e = window.DOMAIN_BASE + "/js";
  seajs.config({
    base: s,
    charset: "utf-8",
    alias: {
      con: e + "/commonBase.js",
      site: e + "/city/site.js",
      siteHash: e + "/city/siteHash.js"
    }
  })
}), seajs.use("base");
