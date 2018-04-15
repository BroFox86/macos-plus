animateFox(".js-animate-fox");

function animateFox(element) {
  "use strict";
  
  $(window).on("load", function() {
    $(element).addClass("is-animated");
  });
}
