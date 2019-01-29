"use strict";

/**
 * Table of contents
 * with show the current position by selecting an item.
 * @class
 * @param {object} options - Object with options.
 * @param {string} options.contents - Contents selector.
 * @param {string} options.headings - Headings selector.
 * @param {number} options.offset - Threshold from top of the screen in pixels that triggers selecting an item.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function PageNav( options ) {
  var contents = document.querySelector( options.contents ),
    headings = document.querySelectorAll( options.headings ),
    offset = options.offset || 0,
    navItems = contents.querySelectorAll( "li", contents );

  /*
   * Handle item selection.
   */
  function select() {
    var heading = isItemActive(),
      id,
      item;

    if ( !heading ) {
      return;
    }

    clear();

    id = heading.id;

    item = contents.querySelector( "li:nth-child(" + id + ")" );

    item.classList.add("is-active");
  }

  /**
   * Return the current item.
   * @private
   * @returns {HTMLElement}
   */
  var isItemActive = (function() {
    var previousItem,
      currentItem;

    return function() {
      var idx = headings.length;

      // Reverse loop to optimize getting a current item
      while( idx-- ) {

        if ( isInArea(headings[idx]) ) {

          currentItem = headings[idx];

          break;
        }
      }

      if ( currentItem == previousItem ) {
        return;
      }

      previousItem = currentItem;

      return currentItem;
    }
  })();

  /**
   * Check if the element is in the specific screen area.
   * @private
   * @param {HTMLElement} elem
   * @returns {Boolean}
   */
  function isInArea( elem ) {
    var viewportTop = pageYOffset,
      elementTop = elem.getBoundingClientRect().top + pageYOffset;

    if ( viewportTop > (elementTop - offset) ) {
      return true;
    }
  }

  /*
   * Clear active state.
   */
  function clear() {

    for ( var i = 0; i < navItems.length; i++ ) {

      navItems[i].classList.remove("is-active");
    }
  }

  [ "scroll", "DOMContentLoaded" ].forEach(function( item ) {
    window.addEventListener( item, select );
  });
}

var contents = new PageNav({
  contents: "[data-toggle='contents']",
  headings: "[data-spy='contents']",
  offset: 300
});