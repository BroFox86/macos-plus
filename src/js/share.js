/**
 * Share the current URL on a social network by opening a new window.
 * @param {number} windowWidth - Window width.
 * @param {number} windowHeight - Window height.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function sharePage( windowWidth, windowHeight ) {
  "use strict";

  document.body.addEventListener( "click", ( event ) => {
    let target = event.target;

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

  function openWindow( element ) {
    const width = `width=${windowWidth}`;
    const height = `height=${windowHeight}`;

    window.open( getUrl( element ), "", `${width}, ${height}` );
  }

  // Get URL without an anchor and make it ready to share.
  function getUrl( element ) {
    const url = window.location.href.replace( /\#\d$/, "" );

    return element.href.replace( /[^=]*$/, url );
  }
}

sharePage( 500, 600 );