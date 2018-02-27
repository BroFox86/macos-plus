var $nav       = $(".site-nav__list"),
    fixed      = "is-fixed",
    mediaQuery = "(min-width: 60em)",
    offset     = $nav.offset().top,
    margin     = $nav.outerHeight();

$(window).scroll(function (event) {
  var y = $(this).scrollTop();

  if (y >= offset && window.matchMedia(mediaQuery).matches) {
    $nav.addClass(fixed);
    $(".header").css("margin-bottom", margin);
  } else {
    $nav.removeClass(fixed);
    $(".header").css("margin-bottom", "");
  }
});