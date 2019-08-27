/**
 * Add custom characters to ordered lists.
 * @param {string} options.list - Ordered lists selector.
 * @param {string} options.items - Characters.
 * @param {string} options.closing - Closing symbol.
 * @version 1.0.1
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function setCustomList({ selector, items, closing }) {
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
  selector: "ol ol",
  items: "абвгдежзиклмнопрстуфхцчшщэюя",
  closing: ")"
});