hideSidebarItem(".js-hide-container", ".js-hide-target", "max-height: 950px", 700);

function hideSidebarItem(container, target, media, maxHeight) {
  "use strict";

  var containerHeight = $(container).outerHeight();

  function handleSidebarItem() {
    if ( containerHeight >= maxHeight ) {
      if (window.matchMedia("(" + media + ")").matches) {
        $(target).addClass("is-hidden");
      } else {
        $(target).removeClass("is-hidden");
      }
    }
  }

  handleSidebarItem();

  $(window).on("resize", function() {
    handleSidebarItem();
  }
)};
