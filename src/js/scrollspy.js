/**
 * Show the current position by selecting a contents item.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
(() => {
  "use strict";

  const headings = document.querySelectorAll(".js-scrollspy-toggle");
  const contents = document.querySelector(".js-scrollspy-target");
  const items = contents.querySelectorAll("li");

  [ "scroll", "DOMContentLoaded" ].forEach(( item ) => {
    window.addEventListener( item, select );
  });

  function select() {
    const activeElement = getActiveElement();

    if ( !activeElement ) {
      return;
    }

    for ( let item of items ) {
      item.classList.remove("is-active");
    }

    items[ activeElement.id - 1 ].classList.add("is-active");
  }

  const getActiveElement = (() => {
    let previousItem;
    let currentItem;

    return () => {
      let sum = headings.length;

      while( sum-- ) {

        if ( isInArea( headings[ sum ] ) ) {

          currentItem = headings[ sum ];

          if ( currentItem == previousItem ) {
            return false;
          }

          return previousItem = currentItem;
        }
      }
    };
  })();

  function isInArea( element ) {
    const viewportTop = pageYOffset;
    const elementTop = element.getBoundingClientRect().top + pageYOffset;
    const OFFSET = 300;

    if ( viewportTop > (elementTop - OFFSET) ) {
      return true;
    }
  }
})();