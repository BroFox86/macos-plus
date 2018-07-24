/* ==========================================================================
   Add the polyfill for enable CSS Sticky on IE
   ========================================================================== */

(function() {
  var element = $("[data-toggle='sidebar']");
  Stickyfill.addOne(element);
})(); 

/* ==========================================================================
   Hide the sidebar item for narrow screens
   ========================================================================== */

(function() {
  "use strict";

  var height = $("[data-toggle='sidebar']").outerHeight(),
      $target = $("[data-target='sidebar']"),
      maxH = window.matchMedia("(max-height: 930px)"),
      minW = window.matchMedia("(min-width: 960px)");

  $(window).on("DOMContentLoaded resize", function() {
    if (height >= 700 && maxH.matches && minW.matches) {
      $target.hide();
    } else {
      $target.show();
    }
  })
})(); 