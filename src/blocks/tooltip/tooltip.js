"use strict";

var tooltip = new Tooltip();

/**
 * Set flying tooltips.
 * @class
 * @augments Transition
 * @author Daur Gamisonia <daurgam@gmail.com>
 * @version 1.0.1
 */
function Tooltip() {
  var tooltip;

  Transition.call( this );

  /*
   * Show the tooltip with a text from title.
   */
  var show = function( event ) {
    var target = event.target,
      text;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    if ( document.body.contains( tooltip ) ) {

      close( event );

      return;
    }

    text = target.title;

    target.setAttribute( "data-text", text );

    target.title = "";

    tooltip = document.createElement("div");

    tooltip.className = "tooltip";

    tooltip.textContent = text;

    tooltip.style.left = event.pageX + 20 + "px";

    tooltip.style.top = event.pageY + 10 + "px";

    document.body.appendChild( tooltip );

    this._fadeIn( tooltip, "block" );

  }.bind( this );

  /*
   * Close the tooltip and restore the title attribute.
   */
  var close = function( event ) {
    var target = event.target,
      text;

    if ( !document.body.contains( tooltip ) ) {
      return;
    }

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    text = target.getAttribute("data-text");

    target.title = text;

    this._fadeOut( tooltip );

    document.body.removeChild( tooltip );

  }.bind( this );

  /*
   * Move the tooltip in accordance with the cursor.
   */
  var move = function( event ) {
    var target = event.target;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    tooltip.style.left = event.pageX + 20 + "px";

    tooltip.style.top = event.pageY + 10 + "px";
  }

  document.body.addEventListener( "mouseover", show );

  document.body.addEventListener( "mousemove", move );

  document.body.addEventListener( "mouseout", close );

  // For compatibility with iOS
  document.body.addEventListener( "click", show );
}