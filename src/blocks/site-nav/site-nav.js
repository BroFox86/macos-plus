toggleFixedNav();

function toggleFixedNav() {

  var $nav    = $(".site-nav__list"),
      $header = $(".header"),
      fixed   = "is-fixed",
      offset  = $nav.offset().top,
      margin  = $nav.outerHeight();

  $(window).scroll(function() {
    var y = $(this).scrollTop();

    if (y >= offset && window.matchMedia("(min-width: 960px)").matches) {
      $nav.addClass(fixed);
      $header.css("margin-bottom", margin);
    } else {
      $nav.removeClass(fixed);
      $header.css("margin-bottom", "");
    }
  });
}