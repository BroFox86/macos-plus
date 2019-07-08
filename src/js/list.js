/**
 * Add custom characters to ordered lists.
 * @param {string} options.list - Ordered lists selector.
 * @param {string} options.items - Characters.
 * @param {string} options.closing - Closing symbol.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function setCustomList( options ) {
  "use strict";

  var items = options.items;
  var selector = options.list;
  var closing = options.closing;
  var style = document.createElement("style");

  document.head.appendChild( style );

  items.split("").forEach(function( item, i ) {

    style.sheet.insertRule(

      selector + "> li:nth-child("+ (i + 1) + ")::before {" +
        "content:'" + item + closing + "'}", 0 );
  });
}

setCustomList({
  list: "ol ol",
  items: "абвгдежзиклмнопрстуфхцчшщэюя",
  closing: ")"
});