$.fn.isInViewport = function(activePoint) {
  
  var elementTop  = $(this).offset().top,
      viewportTop = $(window).scrollTop();
  
  return elementTop < (viewportTop + activePoint);
};

$(window).on("resize scroll", function() {

  if (window.matchMedia("(min-width: 960px)").matches) {

    $(".js-heading").each(function() {
      
      if ( $(this).isInViewport(300) ) {

        var id = $(this).attr("id");

        $(".js-active-section").find("li").removeClass("is-active");
        $(".js-active-section").find("li" + ":nth-child(" + id + ")").addClass("is-active");
      }
    })
  } else {
    $(".js-active-section").find("li").removeClass("is-active");
  }
});