$(document).ready(function() {
  var mainNav = ".main-nav";
  var fixed = "is-fixed";
  var mq = window.matchMedia("(min-width: 60em)");
  var top = $(mainNav).offset().top;
  var navHeight = $(mainNav).outerHeight();

  $(window).scroll(function(event) {
    var y = $(this).scrollTop();

    if (y >= top && mq.matches) {
      $(mainNav).addClass(fixed);
      $(".header").css("margin-bottom", navHeight);
    } else {
      $(mainNav).removeClass(fixed);
      $(".header").css("margin-bottom", "");
    }
  });
});

