toggleScrollBtn("button.scroll-button", "(max-width: 960px)");

function toggleScrollBtn(element, mediaQuery) {

  var $element = $(element),
      display  = "is-visible";

  $(window).scroll(function() {
    if (window.matchMedia(mediaQuery).matches) {
      if ($(window).scrollTop() > 800) {
        $element.addClass(display);
      } else {
        $element.removeClass(display);
      }
    }
  });

  $element.click(function(e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0
      },
      2000
    );
    return false;
  });
}
