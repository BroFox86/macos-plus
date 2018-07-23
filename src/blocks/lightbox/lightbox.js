(function() {
  "use strict";

  var $lightbox = $(".lightbox"),
      $close    = $(".lightbox__close"),
      $mainNav  = $("[data-target='lightbox']"),
      duration  = 200;

  // Add padding to body on Android browsers
  function addPadding(padding) {
    if (window.navigator.userAgent.match("Android") != null) {
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

    // Hide main navigation (for avoid shift on IE)
    $mainNav.css("visibility", "hidden");

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
      $mainNav.css("visibility", "visible");
      $lightbox.find("img").remove();
    }, duration);
  });
})();
