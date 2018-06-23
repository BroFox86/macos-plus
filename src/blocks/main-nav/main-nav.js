/* ==========================================================================
   Set the sticky navigation bar
   ========================================================================== */

(function() {
  "use strict";

  var $nav    = $(".js-fixed-menu"),
      $header = $(".page__header"),
      fixed   = "is-fixed",
      offset  = $nav.offset(),
      margin  = $nav.outerHeight(),
      media   = window.matchMedia("(min-width: 960px)");

  $(window).on("DOMContentLoaded scroll resize", function() {

    var y = $(this).scrollTop();

    if ( (y >= offset.top) && media.matches) {
      $nav.addClass(fixed);
      $header.css("margin-bottom", margin);
    } else {
      $nav.removeClass(fixed);
      $header.css("margin-bottom", "");
    }
  });
}) ();