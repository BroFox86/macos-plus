$(document).ready(function () {

  var $nav      = $(".site-nav__list"),
      isFixed   = "is-fixed",
      mq        = window.matchMedia("(min-width: 60em)"),
      top       = $nav.offset().top,
      navHeight = $nav.outerHeight();

  $(window).scroll(function (event) {
    var y = $(this).scrollTop();

    if (y >= top && mq.matches) {
      $nav.addClass(isFixed);
      $(".header").css("margin-bottom", navHeight);
    } else {
      $nav.removeClass(isFixed);
      $(".header").css("margin-bottom", "");
    }
  });
});