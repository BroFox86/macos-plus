(function() {
  "use strict";

  var $element = $(".js-scroll-btn"),
      visible = "is-visible",
      media = window.matchMedia("(max-width: 960px)");

  $(window).on("scroll resize", function() {
    if ( $(window).scrollTop() > 800 && media.matches) {
      $element.addClass(visible);
    } else {
      $element.removeClass(visible);
    }
  });

  $element.on("click", function() {
    $("html, body").stop().animate( { scrollTop: 0 }, 2000);
  });
}) (); 