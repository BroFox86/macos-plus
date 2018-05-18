toggleScrollBtn(".js-scroll-btn", "max-width: 960px");

function toggleScrollBtn(element, media) {
  "use strict";

  var $element = $(element),
      visible  = "is-visible";

  $(window).on("scroll resize", function() {
    if (window.matchMedia("(" + media + ")").matches) {

      if ($(window).scrollTop() > 800) {
        $element.addClass(visible);
      } else {
        $element.removeClass(visible);
      }
    }
  });

  $element.on("click", function() {
    $("html").stop().animate( { scrollTop: 0 }, 2000);
  });
}