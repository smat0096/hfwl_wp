;(function($){
  $.openPopup = function(popup, callback) {
    $.closePopup();
    popup = $(popup);
    popup.show();
    popup.width();
    popup.addClass("weui-popup__container--visible");
    var modal = popup.find(".weui-popup__modal");
    modal.width();
    modal.transitionEnd(function() {
      modal.trigger("open");
    });
    callback && callback(popup);
  }

  $.closePopup = function(container, callback) {
    container = $(container || ".weui-popup__container--visible");
    container.find('.weui-popup__modal').transitionEnd(function() {
      var $this = $(this);
      $this.trigger("close");
      container.hide();
    })
    container.removeClass("weui-popup__container--visible");
    callback && callback(container);
  };
})($);