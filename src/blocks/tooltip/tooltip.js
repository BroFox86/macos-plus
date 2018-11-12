"use strict";

var tooltip = new Tooltip();

/**
 * Set flying tooltips.
 * @class
 * @augments Transition
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Tooltip() {
  var tooltip;

  Transition.call( this );

  /**
   * Show the tooltip with a text from title.
   * @private
   * @param {HTMLElement} - Element with a text in the title.
   */
  var show = function( event ) {
    var target = event.target,
      text;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    text = target.title;

    // Save it in the data attribute
    target.setAttribute( "data-text", text );

    target.title = "";

    tooltip = document.createElement("div");

    tooltip.className = "tooltip";

    tooltip.textContent = text;

    document.body.appendChild( tooltip );

    this._fadeIn( tooltip, "block" );

  }.bind( this );

  /**
   * Close the tooltip and restore the title attribute.
   * @private
   * @param {HTMLElement} - Element that has a visible tooltip.
   */
  var close = function( event ) {

    var target = event.target,
      text;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    text = target.getAttribute("data-text");

    target.title = text;

    this._fadeOut( tooltip );

    document.body.removeChild( tooltip );

  }.bind( this );

  /**
   * Move the tooltip in accordance with the cursor.
   * @private
   * @param {object} event - Mousemove event object.
   */
  var move = function( event ) {
    var target = event.target,
      mouseX,
      mouseY;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    mouseX = event.pageX + 20;
    mouseY = event.pageY + 10;

    tooltip.style.left = mouseX + "px";
    tooltip.style.top = mouseY + "px";
  }

  document.body.addEventListener( "mouseover", show );

  document.body.addEventListener( "mouseout", close );

  document.body.addEventListener( "mousemove", move );
}