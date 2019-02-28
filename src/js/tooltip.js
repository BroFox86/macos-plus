"use strict";

/**
 * Set flying tooltips.
 * @class
 * @version 2.0.0
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Tooltip() {
  /**
   * Tooltip element.
   * @type {HTMLElement}
   */
  this._tooltip;

  // Add event listener at call
  this.run();
}

Tooltip.prototype._show = function( event ) {
  var target = event.target,
    text;

  if ( target.getAttribute("data-toggle") != "tooltip" ) {
    return;
  }

  if ( document.body.contains( this._tooltip ) ) {

    this._close( event );

    return;
  }

  text = target.title;

  target.setAttribute( "data-text", text );

  target.title = "";

  this._tooltip = document.createElement("div");

  this._tooltip.className = "tooltip";

  this._tooltip.textContent = text;

  this._tooltip.style.left = event.pageX + 20 + "px";

  this._tooltip.style.top = event.pageY + 10 + "px";

  document.body.appendChild( this._tooltip );

  this._tooltip.style.display = "block";

  setTimeout(function() {

    this._tooltip.style.opacity = 1;

  }.bind(this), 30 );
};

Tooltip.prototype._close = function( event ) {
  var target = event.target,
    text;

  if ( !document.body.contains( this._tooltip ) ) {
    return;
  }

  if ( target.getAttribute("data-toggle") != "tooltip" ) {
    return;
  }

  text = target.getAttribute("data-text");

  target.title = text;

  document.body.removeChild( this._tooltip );
};

Tooltip.prototype._move = function( event ) {
  var target = event.target;

  if ( target.getAttribute("data-toggle") != "tooltip" ) {
    return;
  }

  this._tooltip.style.left = event.pageX + 20 + "px";

  this._tooltip.style.top = event.pageY + 10 + "px";
}

Tooltip.prototype.run = function() {
  var body = document.body;

  body.addEventListener( "mouseover", this._show.bind( this ) );

  body.addEventListener( "mousemove", this._move.bind( this ) );

  body.addEventListener( "mouseout", this._close.bind( this ) );

  // For compatibility with iOS
  body.addEventListener( "click", this._show.bind( this ) );
}

var tooltip = new Tooltip();