"use strict";

var scrollButton = new ScrollButton({
  button:      "[data-toggle='scrollBtn']",
  threshold:   document.documentElement.clientHeight * 1.5
});

function ScrollButton(options) {
  var btn = document.querySelector(options.button),
    threshold = options.threshold;

  window.addEventListener("scroll", function() {
    if (pageYOffset > threshold) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  });

  btn.onclick = function() {
    scrollTo(0, 0);
  }
}