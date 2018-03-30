animateFox("img.error__img");

function animateFox(element) {
  $(window).on("load", function() {
    $(element).addClass("is-animated");
  });
}
