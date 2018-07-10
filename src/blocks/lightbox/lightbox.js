(function() {
  "use strict";

  var $lightbox = $(".lightbox"),
      duration  = 300;

  $(document).on("click", "[data-toggle='lightbox']", function(e) {
    e.preventDefault();

    $lightbox.on("touchmove mousewheel", false);

    var originalImage = $(this).attr("href");

    $lightbox
      .children()
      .append('<img class="lightbox__img" src="' + originalImage + '" />')

    $lightbox.fadeIn(duration);
  });

  $lightbox.children().mouseenter(function() {
    $lightbox.off("click");
  });

  function unloadImg() {
    setTimeout(function() {
      $lightbox.find("img").remove();
    }, duration);
  }

  $lightbox.children().mouseleave(function() {
    $lightbox.click(function() {
      $(this).fadeOut(duration);
      unloadImg();
    });
  });

  $(".lightbox__close").click(function() {
    $lightbox.fadeOut(duration);
    unloadImg();
  });
})();
