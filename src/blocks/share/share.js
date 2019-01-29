"use strict";

/* ==========================================================================
   Share buttons
   ========================================================================== */

var shareButton = new ShareButton({
  width: 500,
  height: 600
})

/**
 * Buttons that insert the page URL on social networks by opening a new window.
 * @class
 * @param {object} options - Window dimensions.
 * @param {number} options.width - Window width in pixels.
 * @param {number} options.height - Window height in pixels.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function ShareButton( options ) {
  var width = options.width,
    height = options.height;

  document.body.addEventListener("click", function( event ) {
    var target = event.target;

    while( true ) {

      if ( target == document.body ) {
        break;
      }

      if ( target.getAttribute("data-toggle") != "share" ) {

        target = target.parentElement;

        continue;
      }

      event.preventDefault();

      openWindow( target );

      break;
    }
  });

  /*
   * Open the new window.
   */
  function openWindow( elem ) {

    width = "width=" + width,
    height = "height=" + height;

    window.open( getUrl( elem ), "", width + "," + height );
  }

  /**
   * Get URL without an anchor and make it ready to share.
   * @private
   * @param {HTMLElement} elem - Share button with href attribute.
   * @returns {string} - Code to open a specific website including the page URL.
   */
  function getUrl( elem ) {
    var url = window.location.href.replace( /\#\d$/i, "" );

    return elem.href.replace( /[^=]*$/, url );
  }
};

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
 * @author Daur Gamisonia <daurgam@gmail.com>
 * @version 2.0.0
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