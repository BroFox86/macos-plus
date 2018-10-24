"use strict";

var cyrillicList = new CustomList({
  selector: "ol ol",
  items: "абвгдежзиклмнопрстуфхцчшщэюя",
  closing: ")"
});

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