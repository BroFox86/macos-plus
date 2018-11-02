"use strict";

/* ==========================================================================
   Set scrollspy navigation
   ========================================================================== */

var pageNav = new PageNav({
  contents: "[data-toggle='pageNav']",
  headings: "[data-spy='pageNav']",
  offset: 300
});

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
  var contents = query( options.contents )[0],
    headings = query( options.headings ),
    offset = options.offset || 0,
    navItems = query( "li", contents );

  /**
   * Get an element by query selector.
   * @private
   * @param {string} selector - Selector of an element.
   * @param {HTMLElement} [elem] - HTML Element inside of which should start finding.
   * @returns {NodeList}
   */
  function query( selector, elem ) {

    if ( !elem ) {
      return document.querySelectorAll( selector );

    } else {
      return elem.querySelectorAll( selector );
    }
  }

  [ "scroll", "DOMContentLoaded" ].forEach(function( item ) {
    window.addEventListener( item, handleItemSelection );
  });

  /**
   * Handle item selection.
   * @private
   */
  function handleItemSelection() {
    var heading = isItemActive();

    if ( !heading ) {
      return;
    }

    var id = heading.id,
      item = query( "li:nth-child(" + id + ")", contents )[0];

    clearSelection();

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

        if ( isInViewportArea( headings[idx] ) ) {

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
  function isInViewportArea( elem ) {
    var viewportTop = pageYOffset,
      elementTop = elem.getBoundingClientRect().top + pageYOffset;

    if ( viewportTop > elementTop - offset ) {
      return true;
    }
  };

  /**
   * Clear selection states.
   * @private
   */
  function clearSelection() {

    for ( var i = 0; i < navItems.length; i++ ) {

      navItems[i].classList.remove("is-active");
    }
  }
}