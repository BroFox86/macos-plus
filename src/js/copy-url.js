"use strict";

/* ==========================================================================
   Copy URL button
   ========================================================================== */

/**
 * Button to copy URL of the current page.
 * @class
 * @augments Transition
 * @param {object} options - Query selectors.
 * @param {string} options.button - Button.
 * @param {string} options.output - Output field.
 * @version 2.0.0
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function CopyButton( options ) {

  this._btn = document.querySelector( options.button );

  this._output = document.querySelector( options.output );

  this._wrapper = this._output.parentElement;

  // Add event listener at call
  this.run();
};

CopyButton.prototype = Object.create( Transition.prototype );

/*
 * Copy URL without an anchor link.
 */
CopyButton.prototype._copy = function() {

  this._output.value = window.location.href.replace( /\#\d$/i, "" );

  this._output.focus();

  this._output.select();

  document.execCommand("Copy");
}

CopyButton.prototype._showMessage = function() {

  this._output.blur();

  this._output.value = "Ссылка скопирована!";
}

CopyButton.prototype._handle = function() {
  var duration = this._getDuration(this._wrapper);

  this._slideDown( this._wrapper, "block" );

  setTimeout(function() {

    this._copy();

  }.bind( this ), duration );

  setTimeout(function() {

    this._showMessage();

  }.bind( this ), duration * 2 );
}

CopyButton.prototype.run = function() {
  this._btn.addEventListener( "click", this._handle.bind( this ) );
};

var copyButton = new CopyButton({
  button: "[data-toggle='copyUrl']",
  output: "[data-target='copyUrl']"
});