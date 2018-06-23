/* ==========================================================================
   Set scrollspy navigation
   ========================================================================== */

(function() {
  var $scrollspy = $(".js-scrollspy"),
      media = window.matchMedia("(min-width: 960px)");

  function isInViewport(element, offset) {
    var elementTop  = $(element).offset().top,
        viewportTop = $(window).scrollTop();

    return elementTop < viewportTop + offset;
  }

  $(window).on("DOMContentLoaded resize scroll", function() {
    if (media.matches) {
      $(".article__h2").each(function() {
        if (isInViewport(this, 300)) {
          var id = $(this).attr("id");

          $scrollspy
            .find("li").removeClass("is-active");
          $scrollspy
            .find("li" + ":nth-child(" + id + ")")
            .addClass("is-active");
        }
      });
    } else {
      $scrollspy.find("li").removeClass("is-active");
    }
  });
}) (); 