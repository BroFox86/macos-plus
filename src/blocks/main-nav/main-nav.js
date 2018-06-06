toggleFixedNav(".js-fixed-menu", ".page__header", "min-width: 960px");

function toggleFixedNav(toggle, target, media) {
  "use strict";
  
  var $nav    = $(toggle),
      $header = $(target),
      fixed   = "is-fixed",
      offset  = $nav.offset().top,
      margin  = $nav.outerHeight();

  $(window).on("scroll resize", function() {
    
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