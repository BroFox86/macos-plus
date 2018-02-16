var $nav    = $(".site-nav__list"),
    isFixed = "is-fixed",
    mq      = window.matchMedia("(min-width: 60em)"),
    offset  = $nav.offset().top,
    margin  = $nav.outerHeight();

$(window).scroll(function (event) {
  var y = $(this).scrollTop();

  if (y >= offset && mq.matches) {
    $nav.addClass(isFixed);
    $(".header").css("margin-bottom", margin);
  } else {
    $nav.removeClass(isFixed);
    $(".header").css("margin-bottom", "");
  }
});