"use strict";

(function() {
  var $lightbox = $(".lightbox"),
      $close    = $(".lightbox__close"),
      duration  = 200;

  // Add padding to body on Android browsers
  function addPadding(padding) {
    if (window.navigator.userAgent.match("Android")) {
      $("body").css("padding-right", "0");
    } else {
      $("body").css("padding-right", padding);
    }
  };

  // Open modal
  $(document).on("click", "[data-toggle='lightbox']", function(e) {
    e.preventDefault();

    // Add styles for properly display modal window
    $("body").toggleClass("is-fixed");
    addPadding("15px");

    var originalImage = $(this).attr("href");

    $lightbox
      .find(".lightbox__inner")
      .append('<img class="lightbox__img" src="' + originalImage + '" />');

    $lightbox.fadeIn(duration);
  });

  // Close modal
  $close.click(function() {
    $lightbox.fadeOut(duration);

    setTimeout(function() {
      // Restore initial state and unload image
      $("body").toggleClass("is-fixed");
      addPadding(0);
      $lightbox.find("img").remove();
    }, duration);
  });
})();
