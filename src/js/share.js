/**
 * Share the current URL on a social network by opening a new window.
 * @param {number} windowWidth - Window width.
 * @param {number} windowHeight - Window height.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Share( windowWidth, windowHeight ) {
  "use strict";

  document.body.addEventListener("click", function( event ) {
    var target = event.target;

    while( target != document.body ) {

      if ( !target.classList.contains("js-share-trigger") ) {

        target = target.parentElement;

        continue;
      }

      event.preventDefault();

      openWindow( target );

      break;
    }
  });

  // Open the new window.
  function openWindow( element ) {
    var width = "width=" + windowWidth;
    var height = "height=" + windowHeight;

    window.open( getUrl( element ), "", width + "," + height );
  }

  // Get URL without an anchor and make it ready to share.
  function getUrl( element ) {
    var url = window.location.href.replace( /\#\d$/i, "" );

    return element.href.replace( /[^=]*$/, url );
  }
}

var share = new Share( 500, 600 );