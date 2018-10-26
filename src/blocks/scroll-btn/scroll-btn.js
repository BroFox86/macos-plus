"use strict";

var scrollButton = new ScrollButton({
  button: "[data-toggle='scrollBtn']",
  threshold: document.documentElement.clientHeight * 1.5
});

/**
 * Button that scroll page to top
 * @class
 * @param {Object} options - Object with options.
 * @param {string} options.button - Button selector.
 * @param {number} options.threshold - Threshold in pixels from top of the page that show up the button.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function ScrollButton( options ) {
  var btn = document.querySelector( options.button ),
    threshold = options.threshold;

  window.addEventListener("scroll", function() {

    if ( pageYOffset > threshold ) {
      btn.classList.add("is-visible");

    } else {
      btn.classList.remove("is-visible");
    }
  });

  btn.onclick = function() {
    scrollTo( 0, 0 );
  }
}