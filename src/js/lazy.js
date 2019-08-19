/**
 * Asynchronous image that become visible if they get in on the specific
 * scroll position.
 * @param {number} options.width - Images width.
 * @param {string} options.breakpoint - Media query for case where images are fill the container.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function handleLazyLoad( options ) {
  "use strict";

  const images = document.querySelectorAll("[data-src]");

  window.addEventListener( "DOMContentLoaded", setImageSizes );
  window.addEventListener( "DOMContentLoaded", handle );
  window.addEventListener( "scroll", handle );

  /*
   * Specify image sizes to prevent bounces when the page is scrolling
   * and images aren't yet loaded.
   */
  function setImageSizes() {
    for ( let image of images ) {
      const size = image.getAttribute("data-size");
      const [ width, height ] = [ size.split("x")[0], size.split("x")[1] ];
      const aspectRatio = width / height;

      let actualWidth = options.width;
      let actualHeight;

      if ( window.matchMedia(`(${options.breakpoint})`).matches ) {
        actualWidth = image.parentElement.offsetWidth;
      } else {
        actualHeight = Math.floor( actualWidth / aspectRatio )
      }

      [ image.width, image.height ] = [ actualWidth, actualHeight ];
    }
  }

  function handle() {

    for ( let image of images ) {
      const isLoaded = image.getAttribute("data-src") == "loaded";

      if ( !isInArea( image ) || isLoaded ) {
        continue;
      }

      loadImage( image );
    }
  }

  function isInArea( element ) {
    const bottomViewport = pageYOffset + document.documentElement.clientHeight;
    const elementTop = element.getBoundingClientRect().top + pageYOffset;
    const offset = document.documentElement.clientHeight;

    if ( bottomViewport > (elementTop - offset) ) {
      return true;
    }
  }

  function loadImage( image ) {
    const preloadImg = document.createElement("img");
    const src = image.getAttribute("data-src");
    const style = image.style;

    image.setAttribute( "data-src", "loaded" );

    preloadImg.setAttribute( "src", src );

    preloadImg.onload = () => {

      style.transition = "none";

      style.opacity = 0;

      setTimeout(() => {

        style.transition = "";

        style.opacity = 1;

        image.setAttribute( "src", src );

        /*
         * Clear size attributes after the image load
         * in order to change their size dynamically when resizing the page.
         */
        image.removeAttribute("width");

        image.removeAttribute("height");

      }, 20 );
    };
  }
}

handleLazyLoad({
  width: 530,
  breakpoint: "max-width: 600px"
});