/**
 * Display viewport size of the page.
 * @param {string[]} styles - Array of strings with styles.
 * @author Daur Gamisonia <daurgam@gmail.com>
 * @version 2.0.0
 */
function setViewportIndicator( styles ) {
  "use strict";

  const indicator = document.createElement("div");

  for ( let style of styles ) {
    indicator.style.cssText += `${style};`;
  }

  document.body.appendChild( indicator );

  [ "DOMContentLoaded", "resize" ].forEach(( item ) => {
    window.addEventListener( item, () => {
      indicator.textContent = window.innerWidth + "x" + window.innerHeight;
    });
  });
}

setViewportIndicator([
  "position: fixed",
  "z-index: 9999",
  "bottom: 0",
  "left: 1%",
  "background: white",
  "color: blue"
]);