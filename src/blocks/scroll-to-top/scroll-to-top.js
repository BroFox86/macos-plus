function setToTopBtn() {

  // For bypass the jsdom error associated with matchMedia
  window.matchMedia = window.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    };
  };
  
  var $btn    = $("button.scroll-to-top"),
      mq      = window.matchMedia("(max-width: 960px)"),
      visible = "";

  function handleMqChanges(event) {
    visible = event.matches ? "is-visible" : "";
  
    $(window).scroll(function() {
      if ($(this).scrollTop() > 800) {
        $btn.addClass(visible);
      } else {
        $btn.removeClass(visible);
      }
    });
  
    $btn.click(function(e) {
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: 0
        },
        2000
      );
      return false;
    });
  }
  
  mq.addListener(handleMqChanges);
  handleMqChanges(mq);
}

setToTopBtn();