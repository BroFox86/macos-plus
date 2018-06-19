/* ==========================================================================
   Sticky sidebar
   ========================================================================== */

(function() {
  var element = $(".js-sticky");
  Stickyfill.addOne(element);
}) (); 

/* ==========================================================================
   Hide the sidebar item for narrow screens
   ========================================================================== */

(function() {
  "use strict";

  var containerHeight = $(".js-hide-container").outerHeight(),
      $target         = $(".js-hide-target");

  $(window).on("DOMContentLoaded resize", function() {
    if ( 
      containerHeight >= 700 &&
      window.matchMedia("(max-height: 950px)").matches
    ) {
      $target.hide();
    } else {
      $target.show();
    }
  })
}) (); 