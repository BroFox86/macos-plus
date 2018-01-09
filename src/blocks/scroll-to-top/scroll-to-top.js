$(document).ready(function() {
  var toTopBtn = ".scroll-to-top";
  var visible = "is-visible";

  //Check to see if the window is top if not then display button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 800) {
      $(toTopBtn).addClass(visible);
    } else {
      $(toTopBtn).removeClass(visible);
    }
  });

  //Click event to scroll to top
  $(toTopBtn).click(function() {
    $("html, body").animate({ scrollTop: 0 }, 2000);
    return false;
  });
});
