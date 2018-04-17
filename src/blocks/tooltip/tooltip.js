setTooltip("min-width: 960px", {
  element:   ".js-tooltip",
  duration:  200
},{
  element:   ".js-tooltip-small",
  delay:     700
});

function setTooltip(media, tooltipOptns, secondTooltipOptns) {
  "use strict";

  var tooltipBody      = $('<p class="tooltip"></p>'),
      smallTooltipBody = $('<p class="tooltip tooltip--small"></p>');

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

  function setHoverHandler(optns, tooltipBody) {

    var delay    = optns.delay    || 0,
        duration = optns.duration || 0,
        element  = optns.element;
    
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

  // This is to avoid the jsdom's error
  window.matchMedia = window.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    };
  };

  if (window.matchMedia("(" + media + ")").matches) {
    setHoverHandler(tooltipOptns, tooltipBody);
    setHoverHandler(secondTooltipOptns, smallTooltipBody);
  }
}