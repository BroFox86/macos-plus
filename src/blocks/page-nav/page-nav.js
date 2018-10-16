"use strict";

/* ==========================================================================
   Set scrollspy navigation
   ========================================================================== */

var pageNav = new PageNav({
  contents:   "[data-toggle='pageNav']",
  headings:   "[data-spy='pageNav']",
  offset:     300
})

function PageNav(options) {
  var contents = query(options.contents)[0],
    headings = query(options.headings),
    offset = options.offset || 0,
    navItems = query("li", contents),
    previousItem;

  function query(selector, elem) {
    if (!elem) {
      return document.querySelectorAll(selector);
    } else {
      return elem.querySelectorAll(selector);
    }
  }

  ["scroll", "DOMContentLoaded"].forEach(function(item) {
    window.addEventListener(item, function() {
      handleItemSelection();
    })
  })

  function handleItemSelection() {
    var item = isItemActive();

    if (!item) return;

    var id = item.getAttribute("id"),
      li = query("li:nth-child(" + id + ")", contents)[0];

    clearSelection();

    li.classList.add("is-active");
  }

  function isItemActive() {
    var idx = headings.length,
      currentItem;

    // Reverse loop to optimize getting a current item
    while(idx--) {
      if (isInViewportArea(headings[idx])) {
        currentItem = headings[idx];
        break;
      }
    }

    if (currentItem == previousItem) return;

    previousItem = currentItem;
    return currentItem;
  }

  function isInViewportArea(elem) {
    var viewportTop = pageYOffset,
      elementTop = elem.getBoundingClientRect().top + pageYOffset;

    if (viewportTop > elementTop - offset) {
      return true;
    }
  };

  function clearSelection() {
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove("is-active");
    }
  }
}