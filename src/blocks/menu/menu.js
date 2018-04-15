toggleFixedNav(".js-fixed-menu-toggle", "min-width: 960px");

function toggleFixedNav(element, media) {
  "use strict";

  var $nav    = $(element),
      $header = $(".header"),
      fixed   = "is-fixed",
      offset  = $nav.offset().top,
      margin  = $nav.outerHeight();

  $(window).scroll(function() {
    
    var y = $(this).scrollTop();

    if (y >= offset && window.matchMedia("(" + media + ")").matches) {
      $nav.addClass(fixed);
      $header.css("margin-bottom", margin);
    } else {
      $nav.removeClass(fixed);
      $header.css("margin-bottom", "");
    }
  });
}