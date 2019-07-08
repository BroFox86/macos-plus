/**
 * Asynchronous images that become visible if they get in on the specific scroll positions.
 * @param {number} options.width - Images width.
 * @param {string} options.fullWidth - Media query string for case where images are fill the container.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function handleImageLoading( options ) {
  "use strict";

  var images = document.querySelectorAll("[data-src]");
  var userAgent = window.navigator.userAgent;

  if ( userAgent.match("Trident") && userAgent.match("Edge") ) {
    changePreloader();
  }

  /*
   * Specify image sizes to prevent bounces when the page is scrolling
   * and images aren't yet loaded. Timeout sets it after loading
   * styles to avoid bounces when loading the page.
   */
  setTimeout(function() {
    for ( var i = 0; i < images.length; i++ ) {
      var image = images[i];
      // String with image resolution e.g 1024x768.
      var imageSize = image.getAttribute("data-size");
      var divider = imageSize.search(/[xX,/-]/);
      var width = imageSize.slice( 0, divider );
      var height = imageSize.slice( divider + 1 );
      var aspectRatio = width / height;
      var actualWidth = options.width;
      var actualHeight;

      if ( window.matchMedia( options.fullWidth ).matches ) {
        actualWidth = image.parentElement.offsetWidth;
      }

      actualHeight = Math.floor( actualWidth / aspectRatio );

      image.setAttribute( "width", actualWidth );

      image.setAttribute( "height", actualHeight );
    }
  }, 500 );

  function getImage() {
    var image;
    var isLoaded;

    for ( var i = 0; i < images.length; i++ ) {

      image = images[i];

      isLoaded = image.getAttribute("data-src") == "loaded";

      if ( isLoaded || !isInArea( image ) ) {
        continue;
      }

      loadImage( image );
    }
  }

  function loadImage( image ) {
    var preloadImg = document.createElement("img");
    var src = image.getAttribute("data-src");
    var style = image.style;

    image.setAttribute( "data-src", "loaded" );

    preloadImg.setAttribute( "src", src );

    preloadImg.onload = function() {

      style.transition = "none";

      style.opacity = 0;

      setTimeout(function() {

        style.transition = "";

        style.opacity = 1;

        image.setAttribute( "src", src );

      }, 20 );
    };

    /*
     * Clear size attributes after the image loading
     * in order to change their size dynamically when resizing the page.
     */
    image.onload = function() {

      this.removeAttribute("width");

      this.removeAttribute("height");
    };
  }

  function isInArea( element ) {
    var bottomViewport = pageYOffset + document.documentElement.clientHeight;
    var elementTop = element.getBoundingClientRect().top + pageYOffset;
    var offset = document.documentElement.clientHeight;

    if ( bottomViewport > (elementTop - offset) ) {
      return true;
    }
  }

  // Change preloader image from *.svg to *.gif for IE/Edge.
  function changePreloader() {
    var image;
    var newSrc;

    for ( var i = 0; i < images.length; i++ ) {

      image = images[i];

      newSrc = image.getAttribute("src").replace( /(\.[\w\d]+)$/, ".gif" );

      image.setAttribute( "src", newSrc );
    }
  }

  ["DOMContentLoaded", "scroll"].forEach(function( item ) {
    window.addEventListener( item, getImage );
  });
}

handleImageLoading({
  width: 530,
  fullWidth: "(max-width: 600px)"
});