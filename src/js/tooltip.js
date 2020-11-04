/**
 * Handle flying tooltips.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
(() => {
  "use strict";

  let trigger;
  let title;
  let tooltip;

  document.addEventListener( "mouseover", ( event ) => {
    let button;

    if ( !event.target.classList.contains("js-tooltip-trigger") ) {
      return;
    }

    trigger = event.target;

    title = trigger.title;

    trigger.title = "";

    tooltip = document.createElement("aside");

    tooltip.className = "tooltip";

    tooltip.setAttribute( "role", "tooltip" );

    button = '<button class="tooltip__close" type="button"></button>';

    tooltip.innerHTML = title + button;

    document.body.append( tooltip );
  });

  document.addEventListener( "mousemove", ( event ) => {

    if ( !event.target.classList.contains("js-tooltip-trigger") ) {
      return;
    }

    tooltip.style.left = `${event.pageX + 20}px`;

    tooltip.style.top = `${event.pageY + 10}px`;
  });

  document.addEventListener( "mouseout", ( event ) => {

    if ( !event.target.classList.contains("js-tooltip-trigger") ) {
      return;
    }

    trigger.title = tooltip.textContent;

    document.body.removeChild( tooltip );
  });
})();
