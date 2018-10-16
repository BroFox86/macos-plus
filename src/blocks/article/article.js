"use strict";

var cyrillicList = new CustomList({
  list:      "ol ol",
  items:     "абвгдежзиклмнопрстуфхцчшщэюя",
  closing:   ")"
});

function CustomList(options) {
  var list = options.list,
    items = options.items,
    closing = options.closing,
    style = document.createElement("style");

  document.head.appendChild(style);

  items.split("").forEach(function(item, i) {
    style.sheet.insertRule(
      list + "> li:nth-child("+ (i + 1) + ")::before {\
        content:'" + item + closing + "'}", 0)
  });
};