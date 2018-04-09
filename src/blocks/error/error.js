animateFox("img.error__img");

function animateFox(element) {
  "use strict";
  
  $(window).on("load", function() {
    $(element).addClass("is-animated");
  });
}
