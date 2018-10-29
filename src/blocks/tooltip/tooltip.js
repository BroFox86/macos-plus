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

  document.body.addEventListener("mouseover", function( event ) {
    var target = event.target;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    show( target );
  })

  document.body.addEventListener("mouseout", function( event ) {
    var target = event.target;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    close( target );
  })

  document.body.addEventListener("mousemove", function( event ) {
    var target = event.target;

    if ( target.getAttribute("data-toggle") != "tooltip" ) {
      return;
    }

    move( event );
  });

  /**
   * Show the tooltip with the text from the title attribute.
   * @private
   * @param {HTMLElement} - Element with text in the title.
   */
  var show = function( elem ) {
    // Get the title text
    var text = elem.title;

    // Save it in the data attribute
    elem.setAttribute( "data-text", text );

    // Clear the title
    elem.title = "";

    // Create tooltip
    tooltip = document.createElement("p");
    tooltip.className = "tooltip";
    tooltip.textContent = text;

    document.body.appendChild( tooltip );

    this.fadeIn( tooltip, "block" );

  }.bind( this );

  /**
   * Close the tooltip and restore the title attribute.
   * @private
   * @param {HTMLElement} - Element that has the visible tooltip.
   */
  var close = function( elem ) {
    var text = elem.getAttribute("data-text");

    elem.title = text;

    this.fadeOut( tooltip );

    setTimeout(function() {
      document.body.removeChild( tooltip );
    }, 200 );

  }.bind( this );

  /**
   * Move the tooltip in accordance with cursor.
   * @private
   * @param {object} event - Mousemove event object.
   */
  function move( event ) {
    var mouseX = event.pageX + 20,
      mouseY = event.pageY + 10;

    tooltip.style.left = mouseX + "px";
    tooltip.style.top = mouseY + "px";
  }
}