$(document).ready(function() {
  $(".section__image-link").magnificPopup({
    type: "image",
    closeOnContentClick: true,
    mainClass: "mfp-img-mobile",
    image: { verticalFit: true }
  });

  var toolTip  = ".section__tooltip";
  var tVisible = "section__is-tooltip-visible";

  $(toolTip)
    .hover(
      function() {
        var title = $(this).attr("title");
        $(this)
          .data("tipText", title)
          .removeAttr("title");
        $("<p class=" + tVisible + "></p>")
          .text(title)
          .appendTo("body")
          .fadeIn(300);
      },
      function() {
        $(this).attr("title", $(this).data("tipText"));
        $("." + tVisible).remove();
      }
    )
    .mousemove(function(e) {
      var mousex = e.pageX + 20; //Get X coordinates
      var mousey = e.pageY + 10; //Get Y coordinates
      $("." + tVisible).css({ top: mousey, left: mousex });
    });
});
