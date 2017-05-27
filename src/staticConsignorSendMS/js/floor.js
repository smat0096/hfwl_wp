define(function(require, exports, module) {
  exports.open = function(t) {
    var n = t.find(".js_floor_content");
    t.show();
    n.slideDown();
    //contentHeight = n.height(); 
    // n.css({
    //   bottom: "-" + contentHeight + "px",
    //   height: contentHeight + "px"
    // }).show().animate({
    //   bottom: 0
    // }, 300);
  };
  exports.close = function(t) {
    var n = t.find(".js_floor_content"),
      contentHeight = n.height();
    n.slideUp(200,function(){
      t.hide();
    })
    // n.animate({
    //   bottom: "-" + contentHeight + "px"
    // }, 200, function() {
    //   t.hide()
    // })
  }
})
