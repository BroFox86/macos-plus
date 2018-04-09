setTooltip("article .article__tooltip");

function setTooltip(element) {
  "use strict";

  var $element = $(element),
      $body    = $("body"),
      duration = 200;

  $element
    .hover(function() {
      var title = $(this).attr("title");

      $(this)
        .data("tipText", title)
        .attr("title", "");

      $('<p class="tooltip"></p>')
        .text(title)
        .appendTo($body)
        .fadeIn(duration);
      },
      function() {
        $(this).attr("title", $(this).data("tipText"));
        $("p.tooltip").fadeOut(duration);
      }
    )

    .mousemove(function(e) {
      var mousex = e.pageX + 20;
      var mousey = e.pageY + 10;

      $("p.tooltip").css({
        top: mousey,
        left: mousex
      });
    });
}
