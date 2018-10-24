"use strict";

var displayViewportSize = new ViewportIndicator([
  "position: fixed",
  "bottom: 0",
  "left: 1%",
  "z-index: 9999",
  "background: white",
  "color: blue"
]);

function ViewportIndicator( options ) {
  var styles = "",
    indicator;

  // Generate styles string from options
  for ( var i = 0; i < options.length; i++ ) {
    styles += options[i] + ";"
  }

  (function generate() {
    indicator = document.createElement("p");
    indicator.id = "viewportIndicator";
    indicator.style.cssText = styles;

    document.body.appendChild( indicator );
  })();

  [ "DOMContentLoaded", "resize" ].forEach(function( item ) {
    window.addEventListener( item, displayViewportSize );
  });

  function displayViewportSize() {
    var scrollbar = window.innerWidth - document.documentElement.clientWidth,
      width = window.innerWidth,
      height = window.innerHeight;

    indicator.innerHTML = (width - scrollbar) + "x" + height;
  }
}