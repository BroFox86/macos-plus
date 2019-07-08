/**
 * Handle flying tooltips.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Tooltip() {
  "use strict";

  var tooltip = document.querySelector(".js-tooltip-body");
  var trigger;
  var title;
  var content;

  function handle( event ) {

    trigger = event.target;

    if ( !trigger.classList.contains("js-tooltip-trigger") ) {
      return;
    }

    if ( tooltip.classList.contains("is-active") ) {
      hide();
      return;
    }

    show();
  }

  function show() {

    title = trigger.title;

    trigger.title = "";

    content = document.createElement("div");

    content.innerText = title;

    tooltip.appendChild( content );

    tooltip.classList.add("is-active");
  }

  function hide() {

    tooltip.classList.remove("is-active");

    trigger.title = content.innerText;

    tooltip.removeChild( content );
  }

  function move( event ) {

    if ( !tooltip.classList.contains("is-active") ) {
      return;
    }

    tooltip.style.left = event.pageX + 20 + "px";

    tooltip.style.top = event.pageY + 10 + "px";
  }

  document.addEventListener( "mouseover", handle.bind(this) );

  document.addEventListener( "mouseout", handle.bind(this) );

  document.addEventListener( "mousemove", move.bind(this) );
}

var tooltip = new Tooltip();