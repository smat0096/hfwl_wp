document.write(' entry-a的输出信息1<br>');
//require("!style!css!./style.css") // 载入 style.css
require('../css/style-a.css');
//import './style.css'; 这样引用会失败,原因未知

//自动遍历图片,进行loader处理;但是不推荐, 如果不在js中单独调用使用,html插件不会自动转换图片路径 
const requireContext = require.context("../img", true, /^.*\.(png|jpg)$/);
const images = requireContext.keys().map(requireContext);

var img = require('../img/1.png');
var imgNode = document.createElement('img');
imgNode.src = img;
var greeter =(require('./modules/module.js')); // 添加模块
var firstNode = document.getElementsByTagName('body')[0].children[0];
var body = document.getElementsByTagName('body')[0];
body.insertBefore(greeter(),firstNode);
body.insertBefore(imgNode,firstNode);
img = require('../img/2.jpg');
imgNode = document.createElement('img');
imgNode.src = img;
body.insertBefore(imgNode,firstNode);

console.log($);
$('#jjj').attr('id','app').text('11这是JQ写入的内容');
console.log(Vue);
