"use strict";

/**
 * Animate the fox picture
 * @module animateFox
 */
(function() {

  function animate() {
    var elem = document.querySelector("[data-toggle='error404']");

    if (!elem) {
      return;
    }

    elem.classList.add("is-animated");
  }

  window.addEventListener( "load", animate );
})();