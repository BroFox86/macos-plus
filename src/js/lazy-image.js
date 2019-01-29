"use strict";

/**
 * Asynchronous images that become visible
 * if they get in on the specific scroll positions.
 * @class
 * @param {Object} options - Query selectors.
 * @param {string} options.images - Asynchronous images.
 * @param {number} options.width - Image width.
 * @param {string} options.fullWidth - Media query string for case where images are fill the container.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function LazyImage( options ) {
  var imgs = document.querySelectorAll( options.images );

  /*
   * Change preloader image from *.svg to *.gif for IE/Edge.
   */
  (function changePreloader() {
    var userAgent = window.navigator.userAgent,
      img,
      newSrc;

    if ( !userAgent.match("Trident") && !userAgent.match("Edge") ) {
      return;
    }

    for ( var i = 0; i < imgs.length; i++ ) {

      img = imgs[i];

      newSrc = img.getAttribute("src").replace( /(\.[\w\d]+)$/, ".gif" );

      img.setAttribute( "src", newSrc );
    }
  })();

  /*
   * Specify image dimensions to prevent bounces when the page is scrolling and images aren't yet loaded.
   */
  function setDimensions() {
    for ( var i = 0; i < imgs.length; i++ ) {
      var img = imgs[i],
        // String with image resolution e.g 1024x768
        imgSize = img.getAttribute("data-size"),
        divider = imgSize.search(/[xX,/-]/),
        width = imgSize.slice( 0, divider ),
        height = imgSize.slice( divider + 1 ),
        aspectRatio = width / height,
        actualWidth = options.width,
        actualHeight;

      if ( window.matchMedia( options.fullWidth ).matches ) {
        actualWidth = img.parentElement.offsetWidth;
      }

      actualHeight = Math.floor( actualWidth / aspectRatio );

      img.setAttribute( "width", actualWidth );
      img.setAttribute( "height", actualHeight );
    }
  }

  /*
   * Set timeout in order to set image dimensions after
   * loading styles to avoid bounces when loading.
   */
  setTimeout( function() {
    setDimensions();
  }, 500);

  function handle() {
    var img,
      isLoaded,
      src;

    for ( var i = 0; i < imgs.length; i++ ) {
      img = imgs[i],
      isLoaded = img.getAttribute("data-src") == "loaded";

      if ( !isInArea( img ) || isLoaded ) {
        continue;
      }

      src = img.getAttribute("data-src");

      img.setAttribute( "data-src", "loaded" );

      display( img, src );
    }
  }

  [ "DOMContentLoaded", "scroll" ].forEach(function( item ) {
    window.addEventListener( item, handle );
  });

  /*
   * Check if the element is in the specific document position
   * out of the screen.
   */
  function isInArea( elem ) {
    var offset = document.documentElement.clientHeight,
      bottomViewport = pageYOffset + document.documentElement.clientHeight,
      elemTop = elem.getBoundingClientRect().top + pageYOffset;

    if ( bottomViewport > elemTop - offset ) {
      return true;
    }
  }

  /*
   * Display image smoothly when it's loaded.
   */
  function display( targetImg, src ) {
    var preloadImg = document.createElement("img"),
      style = targetImg.style;

    preloadImg.setAttribute( "src", src );

    preloadImg.onload = function() {

      style.transition = "none";

      style.opacity = 0;

      setTimeout(function() {

        style.transition = "";

        style.opacity = 1;

        targetImg.setAttribute( "src", src );

      }, 20)
    }

    /*
     * Clear img dimensions attributes after the image is loaded
     * in order to change its size dynamically when resizing the page.
     */
    targetImg.onload = function() {

      targetImg.removeAttribute("width");
      targetImg.removeAttribute("height");

    }
  }
}

var lazyLoad = new LazyImage({
  images: "[data-src]",
  width: 530,
  fullWidth: "(max-width: 600px)"
});