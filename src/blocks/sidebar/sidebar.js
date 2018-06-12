hideSidebarItem(
  ".js-hide-container",
  ".js-hide-target",
  "max-height: 950px",
  700
);

function hideSidebarItem(container, target, media, maxHeight) {
  "use strict";

  $(window).on("DOMContentLoaded resize", function() {
    var containerHeight = $(container).outerHeight();

    if (containerHeight >= maxHeight) {
      
      if (window.matchMedia("(" + media + ")").matches) {
        $(target).addClass("is-hidden");
      } else {
        $(target).removeClass("is-hidden");
      }
    }
  });
}
