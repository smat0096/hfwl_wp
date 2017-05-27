// module.js, 读取配置文件信息
var config = require('../../config.json');

module.exports = function() {
  var greet = document.createElement('h3');
  greet.textContent = config.greetText;
  return greet;
};