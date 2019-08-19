/**
 * Add custom characters to ordered lists.
 * @param {string} options.list - Ordered lists selector.
 * @param {string} options.items - Characters.
 * @param {string} options.closing - Closing symbol.
 * @version 1.0.0
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function setCustomList( options ) {
  "use strict";

  const selector = options.list;
  const items = options.items;
  const closing = options.closing;
  const style = document.createElement("style");

  document.head.appendChild( style );

  items.split("").forEach(( item, index ) => {

    style.sheet.insertRule(

      `${selector} > li:nth-child( ${index + 1} )::before {
        content: "${item}${closing}";
      }`, 0 );
  });
}

setCustomList({
  list: "ol ol",
  items: "абвгдежзиклмнопрстуфхцчшщэюя",
  closing: ")"
});