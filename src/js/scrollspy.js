"use strict";

/**
 * Table of contents with show the current position by selecting an item.
 * @param {number} offset - Threshold from top of the screen in pixels that triggers selecting an item.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function ScrollSpy( offset ) {
  var contents = document.querySelector(".js-scrollspy-target");
  var items = contents.querySelectorAll("li");
  var headings = document.querySelectorAll(".js-scrollspy-toggle");
  var offset = offset || 0;

  function selectItem() {
    var activeElement = getActiveElement();
    var id;

    if ( !activeElement ) {
      return;
    }

    clearSelection();

    id = activeElement.id;

    items[id - 1].classList.add("is-active");
  };

  var getActiveElement = (function() {
    var previousItem;
    var currentItem;

    return function() {
      var length = headings.length;

      while( length-- ) {

        if ( isInArea( headings[length] ) ) {

          currentItem = headings[length];

          break;
        }
      }

      if ( currentItem == previousItem ) {
        return false;
      }

      previousItem = currentItem;

      return currentItem;
    }
  })();

  function isInArea( element ) {
    var viewportTop = pageYOffset;
    var elementTop = element.getBoundingClientRect().top + pageYOffset;

    if ( viewportTop > (elementTop - offset) ) {
      return true;
    }
  };

  function clearSelection() {
    for ( var i = 0; i < items.length; i++ ) {
      items[i].classList.remove("is-active");
    }
  };

  ["scroll", "DOMContentLoaded"].forEach(function( item ) {
    window.addEventListener( item, selectItem );
  });
}

var contents = new ScrollSpy( 300 );