setLightbox("a.article__img-wrapper");

function setLightbox(element) {
  
  var $element  = $(element),
      $lightbox = $("div.lightbox"),
      duration  = 300,
      $body     = $("body");

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


