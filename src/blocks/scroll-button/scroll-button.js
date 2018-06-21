(function() {
  "use strict";

  var $element = $(".js-scroll-btn"),
      visible  = "is-visible";

  $(window).on("scroll resize", function() {
    if (
      window.matchMedia("(max-width: 960px)").matches && 
      $(window).scrollTop() > 800
    ) {
      $element.addClass(visible);
    } else {
      $element.removeClass(visible);
    }
  });

  $element.on("click", function() {
    $("html, body").stop().animate( { scrollTop: 0 }, 2000);
  });
}) (); 