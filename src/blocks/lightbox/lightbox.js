setLightbox(".js-lightbox", 300);

function setLightbox(element, duration) {
  "use strict";

  var $element  = $(element),
      $lightbox = $(".lightbox"),
      $body     = $("body"),
      duration  = duration || 0;

  $element.on("click", function(event) {
    event.preventDefault();
    $lightbox.on("touchmove mousewheel", false);
    
    var originalImage = $(this).attr("href");

    $lightbox
      .children()
      .append('<img class="lightbox__img" src="' + originalImage + '" />');
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
}


