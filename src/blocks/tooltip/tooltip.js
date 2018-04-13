setTooltip(".js-tooltip", ".js-tooltip-small");

function setTooltip(element1, element2) {
  "use strict";

  var tooltip      = $('<p class="tooltip"></p>'),
      tooltipSmall = $('<p class="tooltip tooltip--small"></p>'),
      duration     = 200;

  function setMousemove(element) {
    $(element).mousemove(function(e) {

      var mousex = e.pageX + 20;
      var mousey = e.pageY + 10;

      $(".tooltip").css({
        top: mousey,
        left: mousex
      });
    });
  }

  function setHoverHandler(element, tooltipBody, delay) {

    delay == delay || 0;
    
    $(element).hover(
      function() {
        var title = $(this).attr("title");

        $(this)
          .data("tipText", title)
          .attr("title", "");

        tooltipBody
          .text(title)
          .appendTo("body")
          .delay(delay)
          .fadeIn(duration);
      },
      function() {
        $(this).attr("title", $(this).data("tipText"));
        $(".tooltip").fadeOut(duration);
      }
    );
    setMousemove(element);
  }

  setHoverHandler(element1, tooltip);
  setHoverHandler(element2, tooltipSmall, 300);
}

