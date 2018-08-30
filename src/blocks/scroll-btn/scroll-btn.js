"use strict";

(function() {
  var $element = $("[data-toggle='scrollBtn']"),
      media    = window.matchMedia("(max-width: 960px)");

  $(window).on("scroll resize", function () {
    if ($(window).scrollTop() > 800 && media.matches) {
      $element.addClass("is-visible");
    } else {
      $element.removeClass("is-visible");
    }
  });

  $element.on("click", function() {
    $("html, body").stop().animate( { scrollTop: 0 }, 2000);
  });
})(); 