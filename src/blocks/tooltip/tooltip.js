setTooltip(".js-tooltip");

function setTooltip(element) {
  "use strict";

  var duration = 300;

  $(element).hover(
    function() {

      var title = $(this).attr("title");

      $(this)
        .data("tipText", title)
        .attr("title", "");

      $('<p class="tooltip"></p>')
        .text(title)
        .appendTo("body")
        .fadeIn(duration);
    },
    
    function() {
      $(this).attr("title", $(this).data("tipText"));
      $(".tooltip").fadeOut(duration);
    }
  );

  $(element).mousemove(function(e) {
    var mousex = e.pageX + 20,
        mousey = e.pageY + 10;

    $(".tooltip").css({
      top: mousey,
      left: mousex
    });
  });
}
