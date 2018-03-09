var $btn    = $("button.scroll-to-top"),
    visible = "is-visible";

$(window).scroll(function() {
  if (window.matchMedia("(max-width: 960px)").matches) {
    if ($(window).scrollTop() > 800) {
      $btn.addClass(visible);
    } else {
      $btn.removeClass(visible);
    }
  }
});

$btn.click(function(e) {
  e.preventDefault();
  $("html, body").animate(
    {
      scrollTop: 0
    },
    2000
  );
  return false;
});
