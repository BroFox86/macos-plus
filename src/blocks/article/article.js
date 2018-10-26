"use strict";

var cyrillicLists = new CustomList({
  selector: "ol ol",
  items: "абвгдежзиклмнопрстуфхцчшщэюя",
  closing: ")"
});

/**
 * Add custom characters to ordered lists.
 * @class
 * @param {Object} options - Object with options.
 * @param {string} options.selector - Selector of the ordered lists (ol).
 * @param {Array} options.items - Array with characters.
 * @param {string} options.closing - Closing symbol after character.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function CustomList( options ) {
  var selector = options.selector,
    items = options.items,
    closing = options.closing,
    style = document.createElement("style");

  document.head.appendChild( style );

  items.split("").forEach(function( item, i ) {

    style.sheet.insertRule(

      selector + "> li:nth-child("+ (i + 1) + ")::before {\
        content:'" + item + closing + "'}", 0 )
  });
};