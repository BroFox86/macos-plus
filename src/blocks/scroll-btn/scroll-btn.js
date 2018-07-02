(function() {
  "use strict";

  var $element = $(".js-scroll-btn"),
      visible = "is-visible",
      media = window.matchMedia("(max-width: 960px)");

  var userAgent = window.navigator.userAgent,
      chrome    = userAgent.indexOf("Chrome"),
      mobile    = userAgent.match("Android|iPhone|iPad|iPod");

  $(window).on("scroll resize", function () {
    if ($(window).scrollTop() > 800 && media.matches) {
      // Turn off the scroll button due to bug in last versions of mobile Chrome
      if (chrome != -1 && mobile == null || chrome == -1) {
        $element.addClass(visible);
      }
    } else {
      $element.removeClass(visible);
    }
  });

  $element.on("click", function() {
    $("html, body").stop().animate( { scrollTop: 0 }, 2000);
  });
}) (); 