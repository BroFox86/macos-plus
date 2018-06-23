(function() {
  "use strict";

  var element = ".js-tooltip", 
      duration = 300;

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
      $(".tooltip").fadeOut(duration, function() {
        $(this).remove();
      });
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
}) (); 