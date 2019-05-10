"use strict";

/**
 * Scroll page to top.
 * @param {Object} options - Options object.
 * @param {string} options.button - Button selector.
 * @param {number} [options.threshold=0] - Threshold in pixels from top of the page that show up the button.
 * @param {number} [options.step=100] - Step in pixels. Larger values make animation faster.
 * @version 3.0.0
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function ScrollButton( options ) {
  var button = document.querySelector( options.button );
  var threshold = options.threshold || 0;
  var step = (-options.step) || (-100);
  var timeOut;

  this.scrollUp = function() {

    if (document.documentElement.scrollTop !=0 || document.body.scrollTop !=0) {

      window.scrollBy( 0, step );

      timeOut = setTimeout(function() {

        this.scrollUp();

      }.bind(this), 10 );

    } else {
      clearTimeout( timeOut );
    }
  };

  function toggleVisibility() {
    if ( pageYOffset > threshold ) {
      button.classList.add("is-active");
    } else {
      button.classList.remove("is-active");
    }
  };

  window.addEventListener( "scroll", toggleVisibility );

  button.onclick = this.scrollUp.bind(this);
}

var scrollButton = new ScrollButton({
  button: ".js-scroll-button-toggle",
  threshold: document.documentElement.clientHeight * 1.5,
  step: 200
});