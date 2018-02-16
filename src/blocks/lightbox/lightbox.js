var
  $lightbox = $(".lightbox"),
  duration  = 300;

$(".article__img-wrapper").on("click", function (e) {
  e.preventDefault();

  $this = $(this);

  var largeImage = $this.attr("href"),
      imageAlt   = $this.children("img").attr("alt");

  $('body').bind("mousewheel", function () {
    return false;
  });

  $lightbox.find("img").attr({
    src: largeImage,
    alt: imageAlt
  });

  $lightbox.fadeIn(duration);
});

$lightbox.children().mouseenter(function () {
  $lightbox.unbind("click");
});

function unloadImg() {
  setTimeout(function () {
    $lightbox.find("img").attr({
      src: "",
      alt: ""
    });
  }, 500);
};

var $body = $('body');

$lightbox.children().mouseleave(function () {
  $lightbox.on("click", function () {
    $body.unbind("mousewheel");
    $(this).fadeOut(duration);
    unloadImg();
  })
});

$(".lightbox__close").on("click", function () {
  $body.unbind("mousewheel");
  $lightbox.fadeOut(duration);
  unloadImg();
})