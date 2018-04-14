animateFox(".js-animate");

function animateFox(element) {
  "use strict";
  
  $(window).on("load", function() {
    $(element).addClass("is-animated");
  });
}
