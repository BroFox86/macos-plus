(function() {
  "use strict";

  var $element = $(".js-scroll-btn"),
      visible = "is-visible",
      media = window.matchMedia("(max-width: 960px)");

  var userAgent = window.navigator.userAgent.indexOf("Chrome");

  $(window).on("scroll resize", function() {
    // Turn off the scroll button due to bug in last versions of mobile Chrome
    if ( $(window).scrollTop() > 800 && media.matches && userAgent == -1) {
      $element.addClass(visible);
    } else {
      $element.removeClass(visible);
    }
  });

  $element.on("click", function() {
    $("html, body").stop().animate( { scrollTop: 0 }, 2000);
  });
}) (); 