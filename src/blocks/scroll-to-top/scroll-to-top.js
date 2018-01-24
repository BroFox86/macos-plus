$(document).ready(function() {
  var $btn    = $(".scroll-to-top"),
      visible = "is-visible";

  $(window).scroll(function() {
    if ($(this).scrollTop() > 800) {
      $btn.addClass(visible);
    } else {
      $btn.removeClass(visible);
    }
  });

  $btn.click(function(e) {
    $("html, body").animate({ scrollTop: 0 }, 2000);
    return false;
  });
});
