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

  var height = $(".js-hide-container").outerHeight(),
      $target = $(".js-hide-target"),
      maxH = window.matchMedia("(max-height: 930px)"),
      minW = window.matchMedia("(min-width: 960px)");

  $(window).on("DOMContentLoaded resize", function() {
    if (height >= 700 && maxH.matches && minW.matches) {
      $target.hide();
    } else {
      $target.show();
    }
  })
}) (); 