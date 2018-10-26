"use strict";

/* ==========================================================================
   Share buttons
   ========================================================================== */

var shareButtons = new ShareButtons({
  width: 500,
  height: 600
})

/**
 * Buttons that post the page URL on social networks by opening a new window.
 * @class
 * @param {object} options - Window dimensions.
 * @param {number} options.width - Window width in pixels.
 * @param {number} options.height - Window height in pixels.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function ShareButtons( options ) {
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

  /**
   * Open the new window.
   * @private
   * @param {HTMLElement} elem - Share button.
   */
  function openWindow( elem ) {

    width = "width=" + width,
    height = "height=" + height;

    window.open( getUrl( elem ), "", width + "," + height );
  }

  /**
   * Get the page URL without an anchor and make it ready to share.
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

var copyUrl = new CopyUrl({
  button: "[data-toggle='copyUrl']",
  output: "[data-target='copyUrl']"
});

/**
 * Button to copy URL of the current page.
 * @class
 * @augments Transition
 * @param {object} options - CSS selectors.
 * @param {string} options.button - Button.
 * @param {string} options.output - Output field.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function CopyUrl( options ) {

  Transition.call( this );

  var btn = document.querySelector( options.button ),
    output = document.querySelector( options.output ),
    wrapper = output.parentElement,
    duration = this.getDuration(wrapper);

  btn.onclick = function() {

    this.slideDown( wrapper, "block" );

    setTimeout(function() {

      copyUrl();

    }, duration );

    setTimeout(function() {

      showMessage();

    }, duration * 2 );

  }.bind( this );

  /**
   * Copy URL without an anchor link.
   * @private
   */
  function copyUrl() {

    output.value = window.location.href.replace( /\#\d$/i, "" );

    output.focus();

    output.select();

    document.execCommand("Copy");
  }

  /**
   * Show the message.
   * @private
   */
  function showMessage() {

    output.blur();

    output.value = "Ссылка скопирована!";
  }
};
