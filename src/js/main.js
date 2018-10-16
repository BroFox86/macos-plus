"use strict";

function animateDisplayProperty(elem, value) {
  switch(value) {
    case "none":
      elem.classList.remove("is-visible");

      // Get the duration value in ms
      var duration = parseFloat(getComputedStyle(elem).transitionDuration);
          duration = duration * 1000;

      setTimeout(function() {
        elem.style.display = "";
      }, duration);
    break;

    default:
      elem.style.display = value;
      setTimeout(function() {
        elem.classList.add("is-visible")
      }, 10)
    break;
  }
}