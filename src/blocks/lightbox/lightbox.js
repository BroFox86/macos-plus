setLightbox("article a.article__img-wrapper");

function setLightbox(element) {
  var $element  = $(element),
      $lightbox = $("div.lightbox"),
      duration  = 300,
      $body     = $("body");

  $element.click(function(event) {
    event.preventDefault();

    $body.bind("mousewheel", function() {
      return false;
    });

    var originalImage = $(this).attr("href");

    $lightbox
      .children()
      .append('<img class="lightbox__img" src="' + originalImage + '" />');
    $lightbox.fadeIn(duration);
  });

  $lightbox.children().mouseenter(function() {
    $lightbox.unbind("click");
  });

  function unloadImg() {
    setTimeout(function() {
      $lightbox.find("img").remove();
    }, duration);
  }

  $lightbox.children().mouseleave(function() {
    $lightbox.click(function() {
      $body.unbind("mousewheel");
      $(this).fadeOut(duration);
      unloadImg();
    });
  });

  $(".lightbox__close").click(function() {
    $body.unbind("mousewheel");
    $lightbox.fadeOut(duration);
    unloadImg();
  });
}


