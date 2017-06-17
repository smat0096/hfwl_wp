// require('../css/main.min.css');
// 全局变量
window._G_ = {
  // 生产模式 0 本地 [调试环境]; 1 本地文件路径,服务器数据接口[调试环境]; 2.服务器文件路径,服务器数据接口 [生产环境]
  mode: {
    status: 0,
    debug: 0,
    server: 2
  },
  // 用户注册类型
  noType: 0,
  driver: 1,
  sender: 2,
  business: 3,
  factory: 4,
  // 用户审核状态
  auditIng: 0,
  auditSuccess: 1,
  auditError: 2,
  auditNotyet: 3,
  // 接口
  url: {}
}
_G_.url = G.url
switch (process.env.NODE_ENV) {
  case 'development' :
    _G_.mode.status = _G_.mode.debug
    break
  case 'production' :
    _G_.mode.status = _G_.mode.server
    break
  default:
    break
}
var basicUrl = window.location.protocol + '\/\/' + window.location.host
if (window._G_.mode.status == window._G_.mode.server) {
  basicUrl += '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl' // 服务器文件基础路径;
};
