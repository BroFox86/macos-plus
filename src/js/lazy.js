/**
 * Asynchronous image that become visible if they get in on the specific
 * scroll position.
 * @param {number} options.actualWidth - Images width.
 * @param {string} options.breakpoint - Media query for case where images are fill the container.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function handleLoadImages({ actualWidth, breakpoint }) {
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

      if ( window.matchMedia(`(${breakpoint})`).matches ) {
        actualWidth = image.parentElement.offsetWidth;
      }

      let actualHeight = Math.floor( actualWidth / aspectRatio );

      [ image.width, image.height ] = [ actualWidth, actualHeight ];
    }
  }

  function handle() {
    for ( let image of images ) {
      const isLoaded = image.getAttribute("data-src") == "loaded";

      if ( isLoaded || !isInArea( image ) ) {
        continue;
      }

      loadImage( image );
    }
  }

  function isInArea( image ) {
    const bottomViewport = pageYOffset + document.documentElement.clientHeight;
    const elementTop = image.getBoundingClientRect().top + pageYOffset;
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

handleLoadImages({
  actualWidth: 530,
  breakpoint: "max-width: 600px"
});