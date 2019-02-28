"use strict";

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

var share = new ShareButton({
  width: 500,
  height: 600
});