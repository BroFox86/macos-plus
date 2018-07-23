(function() {
  "use strict";

  var $element = $("[data-toggle='scrollBtn']"),
      visible = "is-visible",
      media = window.matchMedia("(max-width: 960px)");

  var userAgent = window.navigator.userAgent,
      chrome    = userAgent.match("Chrome"),
      devices   = userAgent.match("Android|iPhone|iPad|iPod");

  /* 
     Disable the scroll button on mobile Chrome 
     due to bug in last versions of the browser. 
  */

  $(window).on("scroll resize", function () {
    if ($(window).scrollTop() > 800 && media.matches) {
      // Disable on Chrome for Mobile
      if (chrome != null && devices == null || chrome == null) {
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