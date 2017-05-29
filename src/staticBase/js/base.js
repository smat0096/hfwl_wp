//全局变量
window._G_={
  //生产模式 0 本地 [调试环境]; 1 本地文件路径,服务器数据接口[调试环境]; 2.服务器文件路径,服务器数据接口 [生产环境]
  mode : {
    status : 0,
    debug : 0,
    build : 1,
    server : 2,
  },
  //用户注册类型
  noType : 0,
  driver : 1,
  sender : 2,
  business : 3,
  factory : 4,
  //用户审核状态
  auditIng : 0,
  auditSuccess : 1,
  auditError : 2,
  auditNotyet : 3,
  //接口
  url:{}
}
_G_.url = G.url;
switch(G.env){
  case 'dev' : 
    _G_.status = 0;
    break;
  case 'browser' :
    _G_.status = 1;
    break;
  case 'product' : 
    _G_.status = 2;
    break;
  default:
    break;
} 
var basicUrl = window.location.protocol +'\/\/'+window.location.host;
if(window._G_.mode.status == window._G_.mode.server){
  basicUrl += '/addons/ewei_shopv2/plugin/wuliu/template/mobile/default/hfwl'; //服务器文件基础路径;
};
